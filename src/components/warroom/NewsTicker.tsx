"use client";

import type { NewsArticle } from "@/lib/types";

function severityColor(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes("conflict") || cat.includes("military"))
    return "text-red-400";
  if (cat.includes("diplomacy") || cat.includes("sanctions"))
    return "text-orange-400";
  return "text-[var(--muted-strong)]";
}

export default function NewsTicker({ news }: { news: NewsArticle[] }) {
  if (!news.length) return null;

  const items = news.map((article) => (
    <a
      key={article.id}
      href={article.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 px-4 hover:underline ${severityColor(article.category)}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
        {article.confidenceLevel === "VERIFIED" ? "VERIFIED" : "ALERT"}
      </span>
      <span className="text-sm">{article.title}</span>
      <span className="text-xs text-[var(--muted)]">— {article.source}</span>
    </a>
  ));

  return (
    <div className="overflow-hidden border-b border-[var(--border)] bg-[var(--background)] py-2">
      <div className="ticker-track flex whitespace-nowrap">
        {items}
        <span className="px-6 text-[var(--border)]">|</span>
        {items}
        <span className="px-6 text-[var(--border)]">|</span>
      </div>
    </div>
  );
}
