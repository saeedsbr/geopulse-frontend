import RSSParser from "rss-parser";
import type { NewsArticle } from "@/lib/types";

const parser = new RSSParser();

interface FeedSource {
  name: string;
  url: string;
  defaultCategory: string;
}

const FEEDS: FeedSource[] = [
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", defaultCategory: "Conflict" },
  { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", defaultCategory: "Country Intelligence" },
  { name: "Dawn", url: "https://www.dawn.com/feed", defaultCategory: "Country Intelligence" },
  { name: "The Guardian", url: "https://www.theguardian.com/world/rss", defaultCategory: "Country Intelligence" },
  { name: "Arab News", url: "https://www.arabnews.com/rss.xml", defaultCategory: "Country Intelligence" },
  { name: "France 24", url: "https://www.france24.com/en/rss", defaultCategory: "Diplomacy" },
];

// Country detection patterns
const COUNTRY_PATTERNS: { iso: string; patterns: RegExp }[] = [
  { iso: "USA", patterns: /\b(united states|u\.s\.|america|washington|pentagon|white house|biden|trump)\b/i },
  { iso: "IRN", patterns: /\b(iran|tehran|iranian|khamenei|rouhani|persian gulf|strait of hormuz|irgc)\b/i },
  { iso: "ISR", patterns: /\b(israel|israeli|jerusalem|netanyahu|gaza|hamas|hezbollah|idf|tel aviv|west bank)\b/i },
  { iso: "PAK", patterns: /\b(pakistan|pakistani|islamabad|karachi|lahore|imran khan|pak\b)\b/i },
  { iso: "RUS", patterns: /\b(russia|russian|moscow|kremlin|putin|crimea)\b/i },
  { iso: "UKR", patterns: /\b(ukraine|ukrainian|kyiv|zelensky|donbas|dnipro)\b/i },
  { iso: "CHN", patterns: /\b(china|chinese|beijing|xi jinping|pla|south china sea)\b/i },
  { iso: "TWN", patterns: /\b(taiwan|taiwanese|taipei|taiwan strait)\b/i },
  { iso: "PRK", patterns: /\b(north korea|pyongyang|kim jong.un|dprk|korean peninsula)\b/i },
];

// Category detection keywords
const CATEGORY_KEYWORDS: { category: string; patterns: RegExp }[] = [
  { category: "Conflict", patterns: /\b(war|attack|strike|bomb|kill|dead|casualt|missile|drone|fight|clash|combat|invasion|offensive)\b/i },
  { category: "Military", patterns: /\b(military|army|navy|air force|troops|weapon|defense|defence|soldier|deploy|nuclear|missile)\b/i },
  { category: "Diplomacy", patterns: /\b(diplomat|negotiat|talks|treaty|sanction|ceasefire|peace|summit|accord|deal|envoy|ambassador)\b/i },
  { category: "Economic", patterns: /\b(econom|gdp|inflation|trade|tariff|oil price|market|growth|recession|imf|world bank|export|import)\b/i },
];

function detectCountries(text: string): string[] {
  const found: string[] = [];
  for (const { iso, patterns } of COUNTRY_PATTERNS) {
    if (patterns.test(text)) found.push(iso);
  }
  return found;
}

function detectCategory(text: string, defaultCategory: string): string {
  for (const { category, patterns } of CATEGORY_KEYWORDS) {
    if (patterns.test(text)) return category;
  }
  return defaultCategory;
}

// In-memory cache
let cachedArticles: NewsArticle[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function isCacheValid(): boolean {
  return cachedArticles !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS;
}

async function fetchSingleFeed(source: FeedSource): Promise<NewsArticle[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items ?? []).slice(0, 15).map((item, idx) => {
      const text = `${item.title ?? ""} ${item.contentSnippet ?? ""} ${item.content ?? ""}`;
      const countries = detectCountries(text);
      const category = detectCategory(text, source.defaultCategory);

      return {
        id: hashCode(`${source.name}-${item.link ?? idx}`),
        title: item.title ?? "Untitled",
        content: (item.contentSnippet ?? item.content ?? "").slice(0, 300),
        source: source.name,
        sourceUrl: item.link ?? "",
        imageUrl: "",
        publishedAt: item.isoDate ?? new Date().toISOString(),
        confidenceLevel: "VERIFIED" as const,
        category,
        relatedCountries: countries,
      };
    });
  } catch (err) {
    console.warn(`[RSS] Failed to fetch ${source.name}:`, err instanceof Error ? err.message : err);
    return [];
  }
}

/** Simple string hash to generate stable numeric IDs */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export async function fetchRSSNews(): Promise<NewsArticle[]> {
  // Return cache if still valid
  if (isCacheValid()) {
    return cachedArticles!;
  }

  const results = await Promise.allSettled(FEEDS.map(fetchSingleFeed));

  const articles: NewsArticle[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    }
  }

  // Sort newest first, limit to 50
  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const limited = articles.slice(0, 50);

  // Only cache if we got results
  if (limited.length > 0) {
    cachedArticles = limited;
    cacheTimestamp = Date.now();
  }

  return limited;
}
