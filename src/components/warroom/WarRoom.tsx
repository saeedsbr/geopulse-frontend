import Link from "next/link";
import { AlertTriangle, ArrowRight, Globe, Radar, Shield } from "lucide-react";
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

export default function WarRoom({ data }: { data: WarRoomType }) {
  const { activeConflicts, recentEvents, breakingNews, alerts, globalStats } = data;

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
                    <span key={`${conflict.id}-${participant.isoCode}`} className="rounded-full border border-dark-700 px-2.5 py-1">
                      {participant.countryName} · {participant.role}
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
