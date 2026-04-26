import type { AnalysisResource } from "@/lib/types";
import { ExternalLink, FileText, PlayCircle } from "lucide-react";

function typeTone(type: AnalysisResource['type']) {
  return type === 'VIDEO' ? 'badge-medium' : 'badge-low';
}

export default function AnalysisFeed({ resources }: { resources: AnalysisResource[] }) {
  return (
    <div className="space-y-6">
      {resources.map((resource) => (
        <article key={resource.id} className="card-hover">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={typeTone(resource.type)}>{resource.type}</span>
                <span className="text-xs text-[var(--muted)]">{resource.source}</span>
                <span className="text-xs text-[var(--muted)]">{resource.region}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--foreground)]">{resource.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{resource.summary}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-muted)] px-3 py-2 text-xs text-[var(--muted-strong)]">
              <div className="flex items-center gap-2">
                {resource.type === 'VIDEO' ? <PlayCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                <span>{resource.platform || resource.type}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
            <span>{new Date(resource.publishedAt).toLocaleString()}</span>
            {resource.analyst && (
              <>
                <span>•</span>
                <span>{resource.analyst}</span>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {resource.topics.map((topic) => (
              <span key={topic} className="rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs text-primary-300">
                {topic}
              </span>
            ))}
          </div>

          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
          >
            Open analysis source <ExternalLink className="h-4 w-4" />
          </a>
        </article>
      ))}
    </div>
  );
}
