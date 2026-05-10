import Link from "next/link";
import { AlertTriangle, ArrowRight, Filter, Globe, Radar, Shield } from "lucide-react";
import type { WarRoom as WarRoomType } from "@/lib/types";
import ConflictMap from "./ConflictMap";
import TrendBars from "./TrendBars";

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card-hover">
      <p className="text-sm text-dark-400">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-dark-400">{hint}</p>
    </div>
  );
}

function relativeTime(iso?: string) {
  if (!iso) return "Unknown";
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function WarRoom({ data }: { data: WarRoomType }) {
  const { activeConflicts, recentEvents, breakingNews, alerts, globalStats, highlights = [], lastUpdated } = data;
  const topSources = Array.from(new Set(breakingNews.map((item) => item.source))).slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-dark-900 to-dark-950 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-red-300">
              <Radar className="h-3.5 w-3.5" />
              Live intelligence picture
            </div>
            <h1 className="text-4xl font-bold text-white">War Room</h1>
            <p className="mt-4 text-lg text-dark-300">
              A single surface for active conflicts, validation-aware updates, country exposure, and the strategic ripple effects behind the headlines.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Active conflicts" value={String(globalStats.totalActiveConflicts)} hint="Prioritized for the live picture" />
            <StatCard label="Countries affected" value={String(globalStats.totalCountriesAffected)} hint="Direct participants or pressure points" />
            <StatCard label="Estimated casualties" value={globalStats.totalCasualties.toLocaleString()} hint="Aggregated from backend stats" />
            <StatCard label="Critical alerts" value={String(globalStats.criticalAlerts)} hint="Requires analyst attention" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">Situation update</p>
                <p className="mt-2 text-sm text-dark-300">Last updated {relativeTime(lastUpdated)}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-dark-300">
                {topSources.map((source) => (
                  <span key={source} className="rounded-full border border-white/10 px-3 py-1">{source}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {(highlights.length ? highlights : breakingNews.slice(0, 3).map((item) => ({
                headline: item.title,
                summary: item.content,
                source: item.source,
                sourceUrl: item.sourceUrl,
                publishedAt: item.publishedAt,
                confidenceLevel: item.confidenceLevel,
              }))).map((highlight) => (
                <a
                  key={highlight.headline}
                  href={highlight.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-primary-400/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`badge-${highlight.confidenceLevel.toLowerCase()}`}>{highlight.confidenceLevel}</span>
                    <span className="text-xs text-dark-300">{relativeTime(highlight.publishedAt)}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">{highlight.headline}</h3>
                  <p className="mt-2 text-sm text-dark-300 line-clamp-3">{highlight.summary}</p>
                  <p className="mt-3 text-xs text-primary-300">{highlight.source}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center gap-2 text-primary-300">
              <Filter className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Focus lanes</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-dark-300">
              <div>
                <p className="font-medium text-white">Top active regions</p>
                <p className="mt-1">{Array.from(new Set(activeConflicts.map((conflict) => conflict.region))).slice(0, 3).join(" • ")}</p>
              </div>
              <div>
                <p className="font-medium text-white">Highest-risk theater</p>
                <p className="mt-1">{activeConflicts[0]?.name ?? "No live conflict selected"}</p>
              </div>
              <div>
                <p className="font-medium text-white">Analyst recommendation</p>
                <p className="mt-1">Surface last-updated times, strengthen source visibility, and make more homepage blocks clickable for faster drill-down.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title mb-0">Priority theaters</h2>
            <Link href="/conflicts" className="text-sm text-primary-400 hover:text-primary-300">
              View all conflicts
            </Link>
          </div>
          <div className="space-y-4">
            {activeConflicts.map((conflict) => (
              <Link key={conflict.id} href={`/conflicts/${conflict.id}`} className="block rounded-xl border border-dark-700 bg-dark-950/70 p-5 hover:border-primary-500/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{conflict.name}</h3>
                    <p className="mt-1 text-sm text-dark-400">{conflict.region}</p>
                  </div>
                  <span className={`badge-${conflict.severity.toLowerCase()}`}>{conflict.severity}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-dark-300">{conflict.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-dark-400">
                  {conflict.participants.map((participant) => (
                    <span key={`${conflict.id}-${participant.isoCode}`} className={`rounded-full border px-2.5 py-1 ${participant.side === 'AGGRESSOR' || (!participant.side && participant.role === 'AGGRESSOR') ? 'border-red-500/30 text-red-400/80' : participant.side === 'DEFENDER' || (!participant.side && participant.role === 'DEFENDER') ? 'border-blue-500/30 text-blue-400/80' : 'border-dark-700'}`}>
                      {participant.countryName} · {participant.role === 'ALLY' && participant.allyOf ? `Ally of ${participant.allyOf}` : participant.role}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card border-red-500/20 bg-gradient-to-br from-red-500/10 via-[var(--panel)] to-[var(--background)]">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h2 className="section-title mb-0">US-Iran escalation watch</h2>
            </div>
            <div className="space-y-3">
              {breakingNews.filter((article) => {
                const text = `${article.title} ${article.content}`.toLowerCase();
                return text.includes("iran") || text.includes("tehran") || text.includes("gulf") || text.includes("proxy");
              }).slice(0, 3).map((article) => (
                <a key={article.id} href={article.sourceUrl} target="_blank" rel="noreferrer" className="block rounded-xl border p-4 hover:border-red-400/40 bg-[var(--panel-muted)] border-[var(--border)]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-[var(--foreground)]">{article.title}</p>
                    <span className={`badge-${article.confidenceLevel.toLowerCase()}`}>{article.confidenceLevel}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{article.content}</p>
                  <p className="mt-3 text-xs text-[var(--muted)]">Source: {article.source}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h2 className="section-title mb-0">Alerts</h2>
            </div>
            <div className="space-y-3">
              {alerts.length ? alerts.map((alert) => (
                <div key={alert.id} className="rounded-xl border border-dark-700 bg-dark-950/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{alert.title}</p>
                    <span className={`badge-${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                  </div>
                  <p className="mt-2 text-sm text-dark-300">{alert.message}</p>
                </div>
              )) : <p className="text-sm text-dark-400">No active alerts yet.</p>}
            </div>
          </div>

          <div className="card">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary-400" />
              <h2 className="section-title mb-0">Recent reporting</h2>
            </div>
            <div className="space-y-4">
              {breakingNews.length ? breakingNews.map((article) => (
                <a key={article.id} href={article.sourceUrl} target="_blank" rel="noreferrer" className="block rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)] hover:border-primary-500/40">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--foreground)]">{article.title}</p>
                    <span className={`badge-${article.confidenceLevel.toLowerCase()}`}>{article.confidenceLevel}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{article.source}</p>
                </a>
              )) : <p className="text-sm text-[var(--muted)]">No recent reporting yet.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-400" />
            <h2 className="section-title mb-0">Conflict map</h2>
          </div>
          <ConflictMap events={recentEvents} />
        </div>

        <div className="card">
          <h2 className="section-title">Impact scoreboard</h2>
          <TrendBars
            data={activeConflicts.slice(0, 5).map((conflict) => ({
              label: conflict.name,
              value: conflict.totalCasualties,
              tone:
                conflict.severity === "CRITICAL"
                  ? "critical"
                  : conflict.severity === "HIGH"
                    ? "high"
                    : conflict.severity === "MEDIUM"
                      ? "medium"
                      : "low",
            }))}
          />
          <Link href="/countries" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300">
            Explore country dashboards
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
