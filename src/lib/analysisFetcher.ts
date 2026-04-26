import RSSParser from "rss-parser";
import type { AnalysisResource } from "@/lib/types";

const parser = new RSSParser();

interface AnalysisSource {
  name: string;
  url: string;
  type: "VIDEO" | "ARTICLE";
  region: string;
  sourceCountryIso: string;
  sourceCountryName: string;
}

const SOURCES: AnalysisSource[] = [
  // YouTube channels — geopolitical analysis
  { name: "CSIS", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCr5jq6MC_VCe1c5ciIZtk_w", type: "VIDEO", region: "Global", sourceCountryIso: "USA", sourceCountryName: "United States" },
  { name: "Brookings Institution", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCi7jxgIOxcRaF4Q54U7lF3g", type: "VIDEO", region: "Global", sourceCountryIso: "USA", sourceCountryName: "United States" },
  { name: "Council on Foreign Relations", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCL_A4jkwvKuMyToAPy3FQKQ", type: "VIDEO", region: "Global", sourceCountryIso: "USA", sourceCountryName: "United States" },
  { name: "Carnegie Endowment", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCDeDd29TrRzAkSKXBCtGhxA", type: "VIDEO", region: "Global", sourceCountryIso: "USA", sourceCountryName: "United States" },
  { name: "RUSI", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCkPv5___jXTEGQ6VE0a1gdA", type: "VIDEO", region: "Europe", sourceCountryIso: "GBR", sourceCountryName: "United Kingdom" },
  { name: "Al Jazeera English", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCNye-wNBqNL5ZzHSJj3l8Bg", type: "VIDEO", region: "Middle East", sourceCountryIso: "QAT", sourceCountryName: "Qatar" },
  { name: "WION", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC_gUM8rL-Lrg6O3adPW9K1g", type: "VIDEO", region: "South Asia", sourceCountryIso: "IND", sourceCountryName: "India" },
  { name: "TRT World", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC7fWeaHhqgM4Ry-RMpM2YYw", type: "VIDEO", region: "Middle East / Europe", sourceCountryIso: "TUR", sourceCountryName: "Turkey" },
  { name: "France 24 English", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCQfwfsi5VrQ8yKZ-UWmAEFg", type: "VIDEO", region: "Europe", sourceCountryIso: "FRA", sourceCountryName: "France" },
  { name: "DW News", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCknLrEdhRCp1aegoMqRaCZg", type: "VIDEO", region: "Europe", sourceCountryIso: "DEU", sourceCountryName: "Germany" },
  { name: "VisualPolitik EN", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCT3v6vL2H5HK4loLMc8pmCw", type: "VIDEO", region: "Global", sourceCountryIso: "USA", sourceCountryName: "United States" },
  { name: "CaspianReport", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCwnKziETDbHJtx78nIkfYug", type: "VIDEO", region: "Global", sourceCountryIso: "AZE", sourceCountryName: "Azerbaijan" },
  { name: "Peter Zeihan", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsy9I56PY3IngCf_VGjunMQ", type: "VIDEO", region: "Global", sourceCountryIso: "USA", sourceCountryName: "United States" },
  // Article RSS
  { name: "CSIS Analysis", url: "https://www.csis.org/rss.xml", type: "ARTICLE", region: "Global", sourceCountryIso: "USA", sourceCountryName: "United States" },
];

// Detect which countries an analysis piece is about
const COUNTRY_PATTERNS: { iso: string; patterns: RegExp }[] = [
  { iso: "USA", patterns: /\b(united states|u\.s\.|america|washington|pentagon|white house|biden|trump)\b/i },
  { iso: "IRN", patterns: /\b(iran|tehran|iranian|khamenei|rouhani|persian gulf|strait of hormuz|irgc)\b/i },
  { iso: "ISR", patterns: /\b(israel|israeli|jerusalem|netanyahu|gaza|hamas|hezbollah|idf|tel aviv|west bank)\b/i },
  { iso: "PAK", patterns: /\b(pakistan|pakistani|islamabad|karachi|lahore|imran khan)\b/i },
  { iso: "RUS", patterns: /\b(russia|russian|moscow|kremlin|putin|crimea)\b/i },
  { iso: "UKR", patterns: /\b(ukraine|ukrainian|kyiv|zelensky|donbas|dnipro)\b/i },
  { iso: "CHN", patterns: /\b(china|chinese|beijing|xi jinping|pla|south china sea)\b/i },
  { iso: "TWN", patterns: /\b(taiwan|taiwanese|taipei|taiwan strait)\b/i },
  { iso: "IND", patterns: /\b(india|indian|modi|new delhi|kashmir)\b/i },
  { iso: "SAU", patterns: /\b(saudi|riyadh|mbs|kingdom)\b/i },
  { iso: "TUR", patterns: /\b(turkey|turkish|ankara|erdogan|türkiye)\b/i },
  { iso: "EGY", patterns: /\b(egypt|egyptian|cairo|sisi|suez)\b/i },
  { iso: "GBR", patterns: /\b(britain|british|uk\b|london|parliament)\b/i },
  { iso: "FRA", patterns: /\b(france|french|paris|macron|élysée)\b/i },
  { iso: "DEU", patterns: /\b(germany|german|berlin|bundestag|scholz)\b/i },
  { iso: "JPN", patterns: /\b(japan|japanese|tokyo|kishida)\b/i },
  { iso: "PRK", patterns: /\b(north korea|pyongyang|kim jong.un|dprk|korean peninsula)\b/i },
];

function detectTopics(text: string): string[] {
  const topics: string[] = [];
  for (const { iso, patterns } of COUNTRY_PATTERNS) {
    if (patterns.test(text)) topics.push(iso);
  }
  return topics;
}

// In-memory cache — 1 hour TTL
let cachedAnalysis: AnalysisResource[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function isCacheValid(): boolean {
  return cachedAnalysis !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

async function fetchSingleSource(source: AnalysisSource): Promise<AnalysisResource[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items ?? []).slice(0, 10).map((item, idx) => {
      const text = `${item.title ?? ""} ${item.contentSnippet ?? ""} ${item.content ?? ""}`;
      const topics = detectTopics(text);
      // If no specific country detected, use the source country
      if (topics.length === 0) topics.push(source.sourceCountryIso);

      const id = `${source.name.toLowerCase().replace(/\s+/g, "-")}-${hashCode(item.link ?? String(idx))}`;

      return {
        id,
        type: source.type,
        title: item.title ?? "Untitled",
        summary: (item.contentSnippet ?? item.content ?? "").slice(0, 400),
        source: source.name,
        url: item.link ?? "",
        publishedAt: item.isoDate ?? new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        region: source.region,
        topics,
        analyst: source.name,
        platform: source.type === "VIDEO" ? "YouTube" : "Article",
        sourceCountryIso: source.sourceCountryIso,
        sourceCountryName: source.sourceCountryName,
      };
    });
  } catch (err) {
    console.warn(`[Analysis] Failed to fetch ${source.name}:`, err instanceof Error ? err.message : err);
    return [];
  }
}

export async function fetchAnalysis(countryIso?: string): Promise<AnalysisResource[]> {
  // Return cache if valid
  if (isCacheValid() && cachedAnalysis) {
    const all = cachedAnalysis;
    if (!countryIso) return all;
    return all.filter(
      (r) => r.sourceCountryIso === countryIso || r.topics.includes(countryIso)
    );
  }

  const results = await Promise.allSettled(SOURCES.map(fetchSingleSource));

  const resources: AnalysisResource[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      resources.push(...result.value);
    }
  }

  // Sort newest first
  resources.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Cache if we got results
  if (resources.length > 0) {
    cachedAnalysis = resources;
    cacheTimestamp = Date.now();
  }

  if (!countryIso) return resources;
  return resources.filter(
    (r) => r.sourceCountryIso === countryIso || r.topics.includes(countryIso)
  );
}
