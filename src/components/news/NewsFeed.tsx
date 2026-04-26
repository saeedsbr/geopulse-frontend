"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { NewsArticle } from "@/lib/types";

function categoryTone(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("conflict") || normalized.includes("military")) return "badge-high";
  if (normalized.includes("diplomacy")) return "badge-medium";
  if (normalized.includes("economic")) return "badge-low";
  return "badge-low";
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth}mo ago`;
}

const countryNames: Record<string, string> = {
  USA: "United States",
  IRN: "Iran",
  ISR: "Israel",
  PAK: "Pakistan",
  RUS: "Russia",
  UKR: "Ukraine",
  CHN: "China",
  TWN: "Taiwan",
};

export default function NewsFeed({ articles }: { articles: NewsArticle[] }) {
  const [sourceFilter, setSourceFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const sources = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((a) => a.source))).sort()],
    [articles]
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((a) => a.category))).sort()],
    [articles]
  );

  const filtered = useMemo(() => {
    return articles
      .filter((a) => sourceFilter === "All" || a.source === sourceFilter)
      .filter((a) => categoryFilter === "All" || a.category === categoryFilter)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [articles, sourceFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        {/* Source filters */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Source</p>
          <div className="flex flex-wrap gap-2">
            {sources.map((src) => (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  sourceFilter === src
                    ? "border-primary-500 bg-primary-500/20 text-primary-400"
                    : "border-[var(--border)] bg-[var(--panel-muted)] text-[var(--muted-strong)] hover:border-primary-500/40"
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? "border-primary-500 bg-primary-500/20 text-primary-400"
                    : "border-[var(--border)] bg-[var(--panel-muted)] text-[var(--muted-strong)] hover:border-primary-500/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--muted)]">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Articles */}
      <div className="space-y-4">
        {filtered.map((article) => (
          <a
            key={article.id}
            href={article.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="block card-hover group cursor-pointer"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={categoryTone(article.category)}>{article.category}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-strong)]">
                    {article.source}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{relativeTime(article.publishedAt)}</span>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)] group-hover:text-primary-400 transition-colors">
                  {article.title}
                </h2>
              </div>
              <span className={`badge-${article.confidenceLevel.toLowerCase()} shrink-0`}>
                {article.confidenceLevel}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--muted-strong)]">{article.content}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {/* Country chips */}
              <div className="flex flex-wrap items-center gap-2">
                {article.relatedCountries.map((iso) => (
                  <Link
                    key={iso}
                    href={`/countries/${iso}`}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full border border-[var(--border)] bg-[var(--panel-muted)] px-2.5 py-1 text-xs font-medium text-[var(--muted-strong)] hover:border-primary-500/40 hover:text-primary-400 transition-colors"
                  >
                    {countryNames[iso] ?? iso}
                  </Link>
                ))}
              </div>

              {/* Read CTA */}
              <span className="text-sm font-medium text-primary-400 group-hover:text-primary-300 transition-colors">
                Read full article →
              </span>
            </div>
          </a>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-[var(--muted)] py-8">No articles match the selected filters.</p>
        )}
      </div>
    </div>
  );
}
