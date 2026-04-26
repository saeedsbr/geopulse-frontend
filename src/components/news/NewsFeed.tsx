import type { NewsArticle } from "@/lib/types";

function categoryTone(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("conflict") || normalized.includes("military")) return "badge-high";
  if (normalized.includes("diplomacy")) return "badge-medium";
  return "badge-low";
}

export default function NewsFeed({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <article key={article.id} className="card-hover">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={categoryTone(article.category)}>{article.category}</span>
                <span className="text-xs text-dark-500">{article.source}</span>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-white">{article.title}</h2>
            </div>
            <span className={`badge-${article.confidenceLevel.toLowerCase()}`}>{article.confidenceLevel}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-dark-300">{article.content}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-dark-500">
            <span>{article.publishedAt}</span>
            {!!article.relatedCountries.length && (
              <>
                <span>•</span>
                <span>{article.relatedCountries.join(", ")}</span>
              </>
            )}
          </div>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm text-primary-400 hover:text-primary-300"
            >
              Open source report →
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
