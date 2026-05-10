"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Wifi, WifiOff } from "lucide-react";
import { countries, conflicts, newsArticles } from "@/lib/mockData";

interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  description: string;
  url: string;
}

interface SearchResponse {
  countries: SearchResultItem[];
  conflicts: SearchResultItem[];
  news: SearchResultItem[];
  totalResults: number;
}

function searchMockData(query: string): SearchResponse {
  const q = query.toLowerCase();
  const matchedCountries = countries
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.isoCode.toLowerCase().includes(q),
    )
    .map((c) => ({
      id: String(c.id),
      type: "country",
      title: c.name,
      description: `${c.region} — ${c.isoCode}`,
      url: `/countries/${c.isoCode}`,
    }));

  const matchedConflicts = conflicts
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    )
    .map((c) => ({
      id: String(c.id),
      type: "conflict",
      title: c.name,
      description: c.description.slice(0, 100),
      url: `/conflicts/${c.id}`,
    }));

  const matchedNews = newsArticles
    .filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q),
    )
    .slice(0, 5)
    .map((n) => ({
      id: String(n.id),
      type: "news",
      title: n.title,
      description: n.content.slice(0, 100),
      url: n.sourceUrl,
    }));

  return {
    countries: matchedCountries,
    conflicts: matchedConflicts,
    news: matchedNews,
    totalResults:
      matchedCountries.length + matchedConflicts.length + matchedNews.length,
  };
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length === 0) {
        setResults(null);
        setIsOffline(false);
        return;
      }
      setLoading(true);
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const res = await fetch(
          `${apiUrl}/search?q=${encodeURIComponent(query)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
          setIsOffline(false);
        } else {
          throw new Error("Search API returned non-OK");
        }
      } catch {
        // Fallback to local mock search
        const mockResults = searchMockData(query);
        setResults(mockResults);
        setIsOpen(mockResults.totalResults > 0);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const renderSection = (title: string, items: SearchResultItem[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-2">
          {title}
        </h4>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={`${item.type}-${item.id}-${idx}`}>
              <Link
                href={item.url}
                className="block group p-2 hover:bg-primary-500/10 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-primary-400">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--muted)] line-clamp-1">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search intelligence..."
        className="w-48 xl:w-64 bg-[var(--panel)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-full px-4 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-[var(--muted-strong)]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results && results.totalResults > 0) setIsOpen(true);
        }}
      />

      {isOpen && results && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto bg-[var(--panel)] border border-[var(--border)] shadow-xl rounded-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
          {isOffline && (
            <div className="flex items-center gap-2 mb-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2">
              <WifiOff className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-xs text-yellow-300">Local results</span>
            </div>
          )}

          {results.totalResults > 0 ? (
            <>
              {renderSection("Countries", results.countries)}
              {renderSection("Conflicts", results.conflicts)}
              {renderSection("News & Alerts", results.news)}
            </>
          ) : (
            <p className="text-sm text-[var(--muted)] text-center py-4">
              No results found for &ldquo;{query}&rdquo;
            </p>
          )}

          {loading && (
            <p className="text-xs text-center text-primary-400">Loading...</p>
          )}
        </div>
      )}
    </div>
  );
}
