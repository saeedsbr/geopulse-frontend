"use client";

import { useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  AlertTriangle,
  ArrowRight,
  Filter,
  Globe,
  Radar,
  Shield,
  Star,
  RefreshCw,
} from "lucide-react";
import type { WarRoom as WarRoomType } from "@/lib/types";
import { useGeoPulseStore, applyFilters } from "@/lib/store";
import TrendBars from "./TrendBars";
import NewsTicker from "./NewsTicker";
import HomepageFilters from "./HomepageFilters";
import WatchlistPanel from "./WatchlistPanel";

const ConflictMap = dynamic(() => import("./ConflictMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-2xl bg-dark-900 animate-pulse border border-[var(--border)]" />
  ),
});

/* ── helpers ── */

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

function StalenessIndicator({ iso }: { iso?: string }) {
  if (!iso) return null;
  const diffMin = Math.floor(
    (Date.now() - new Date(iso).getTime()) / 60000,
  );
  const color =
    diffMin < 15
      ? "bg-green-400"
      : diffMin < 60
        ? "bg-yellow-400"
        : "bg-red-400";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {relativeTime(iso)}
    </span>
  );
}

function ConfidenceBadge({ level }: { level: string }) {
  const tooltips: Record<string, string> = {
    VERIFIED: "Confirmed by 2+ independent sources",
    DISPUTED: "Sources conflict or information is contested",
    UNCONFIRMED: "Single-source, not yet corroborated",
  };
  return (
    <span
      className={`badge-${level.toLowerCase()} cursor-help`}
      title={tooltips[level] || level}
    >
      {level}
    </span>
  );
}

function getSourceTier(source: string) {
  const tier1 = ["Reuters", "Associated Press", "AFP", "ISW", "U.S. Treasury"];
  const tier2 = [
    "Al Jazeera",
    "Times of Israel",
    "Foreign Policy",
    "Dawn",
    "BBC",
    "The Guardian",
  ];
  if (tier1.some((s) => source.includes(s))) return "Tier 1";
  if (tier2.some((s) => source.includes(s))) return "Tier 2";
  return "Open Source";
}

function StatCard({
  label,
  value,
  hint,
  delta,
  invertDelta,
}: {
  label: string;
  value: string;
  hint: string;
  delta?: number;
  invertDelta?: boolean; // true = positive is bad (casualties), false = positive is good
}) {
  const isUp = delta !== undefined && delta > 0;
  const isDown = delta !== undefined && delta < 0;
  // For casualties/alerts: up is bad (red), down is good (green)
  // For countries/conflicts: up is neutral
  const color = invertDelta
    ? isUp
      ? "text-red-400"
      : isDown
        ? "text-green-400"
        : "text-[var(--muted)]"
    : isUp
      ? "text-yellow-400"
      : isDown
        ? "text-green-400"
        : "text-[var(--muted)]";

  return (
    <div className="card-hover">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <p className="text-3xl font-bold text-[var(--foreground)]">{value}</p>
        {delta !== undefined && (
          <span className={`text-sm font-medium ${color} mb-0.5`}>
            {isUp ? "▲" : isDown ? "▼" : "—"} {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{hint}</p>
    </div>
  );
}

/* ── main component ── */

export default function WarRoom({
  initialData,
}: {
  initialData: WarRoomType;
}) {
  const {
    filters,
    warRoomData,
    setWarRoomData,
    hasNewUpdates,
    setHasNewUpdates,
    pendingData,
    setPendingData,
    setConnectionState,
    addToWatchlist,
    removeFromWatchlist,
    isWatched,
  } = useGeoPulseStore();

  // Seed store with server data on mount
  useEffect(() => {
    if (!warRoomData) {
      setWarRoomData(initialData);
    }
  }, [initialData, warRoomData, setWarRoomData]);

  // Polling effect — every 60 seconds
  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const res = await fetch(`${apiUrl}/warroom`, { cache: "no-store" });
        if (!res.ok) throw new Error("Poll failed");
        const newData: WarRoomType = await res.json();

        if (mounted) {
          const current = warRoomData ?? initialData;
          const changed =
            JSON.stringify(newData.globalStats) !==
              JSON.stringify(current.globalStats) ||
            newData.breakingNews.length !== current.breakingNews.length ||
            newData.alerts.length !== current.alerts.length;

          if (changed) {
            setPendingData(newData);
            setHasNewUpdates(true);
          }
          setConnectionState("connected");
        }
      } catch {
        if (mounted) setConnectionState("disconnected");
      }
    };

    const interval = setInterval(poll, 60_000);
    poll();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPendingUpdates = useCallback(() => {
    if (pendingData) {
      setWarRoomData(pendingData);
      setPendingData(null);
      setHasNewUpdates(false);
    }
  }, [pendingData, setWarRoomData, setPendingData, setHasNewUpdates]);

  // Use store data if available, otherwise initial data
  const rawData = warRoomData ?? initialData;
  const data = useMemo(
    () => applyFilters(rawData, filters),
    [rawData, filters],
  );

  const {
    activeConflicts,
    recentEvents,
    breakingNews,
    alerts,
    globalStats,
    highlights = [],
    lastUpdated,
  } = data;

  const topSources = Array.from(
    new Set(breakingNews.map((item) => item.source)),
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* ── Breaking news ticker ── */}
      <NewsTicker news={breakingNews} />

      {/* ── Filters ── */}
      <HomepageFilters data={rawData} />

      {/* ── Watchlist ── */}
      <WatchlistPanel />

      {/* ── New updates banner ── */}
      {hasNewUpdates && (
        <div className="rounded-xl border border-primary-500/30 bg-primary-500/10 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary-400" />
            <p className="text-sm text-primary-300">
              New intelligence updates available
            </p>
          </div>
          <button
            onClick={applyPendingUpdates}
            className="btn-primary text-sm py-1.5 px-3"
          >
            Apply updates
          </button>
        </div>
      )}

      {/* ── Hero / live intelligence picture ── */}
      <section className="rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-dark-900 to-dark-950 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-red-300">
              <Radar className="h-3.5 w-3.5" />
              Live intelligence picture
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)]">
              War Room
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              A single surface for active conflicts, validation-aware updates,
              country exposure, and the strategic ripple effects behind the
              headlines.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              label="Active conflicts"
              value={String(globalStats.totalActiveConflicts)}
              hint="Prioritized for the live picture"
              delta={globalStats.conflictDelta}
            />
            <StatCard
              label="Countries affected"
              value={String(globalStats.totalCountriesAffected)}
              hint="Direct participants or pressure points"
              delta={globalStats.countriesDelta}
            />
            <StatCard
              label="Estimated casualties"
              value={globalStats.totalCasualties.toLocaleString()}
              hint="Aggregated from backend stats"
              delta={globalStats.casualtyDelta}
              invertDelta
            />
            <StatCard
              label="Critical alerts"
              value={String(globalStats.criticalAlerts)}
              hint="Requires analyst attention"
              delta={globalStats.alertDelta}
              invertDelta
            />
          </div>
        </div>

        {/* Situation update + Focus lanes */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
                  Situation update
                </p>
                <StalenessIndicator iso={lastUpdated} />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                {topSources.map((source) => (
                  <span
                    key={source}
                    className="rounded-full border border-white/10 px-3 py-1"
                  >
                    <span className="text-[10px] text-primary-400/70 mr-1">
                      {getSourceTier(source)}
                    </span>
                    {source}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {(highlights.length
                ? highlights
                : breakingNews.slice(0, 3).map((item) => ({
                    headline: item.title,
                    summary: item.content,
                    source: item.source,
                    sourceUrl: item.sourceUrl,
                    publishedAt: item.publishedAt,
                    confidenceLevel: item.confidenceLevel,
                  }))
              ).map((highlight) => (
                <a
                  key={highlight.headline}
                  href={highlight.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-primary-400/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <ConfidenceBadge level={highlight.confidenceLevel} />
                    <span className="text-xs text-[var(--muted)]">
                      {relativeTime(highlight.publishedAt)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                    {highlight.headline}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3">
                    {highlight.summary}
                  </p>
                  <p className="mt-3 text-xs text-primary-300">
                    {highlight.source}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center gap-2 text-primary-300">
              <Filter className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                Focus lanes
              </p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <div>
                <p className="font-medium text-[var(--foreground)]">
                  Top active regions
                </p>
                <p className="mt-1">
                  {Array.from(
                    new Set(activeConflicts.map((c) => c.region)),
                  )
                    .slice(0, 3)
                    .join(" • ") || "No active regions"}
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)]">
                  Highest-risk theater
                </p>
                <p className="mt-1">
                  {activeConflicts[0]?.name ?? "No live conflict selected"}
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)]">
                  Intelligence confidence
                </p>
                <p className="mt-1">
                  {breakingNews.filter(
                    (n) => n.confidenceLevel === "VERIFIED",
                  ).length}{" "}
                  verified ·{" "}
                  {breakingNews.filter(
                    (n) => n.confidenceLevel === "DISPUTED",
                  ).length}{" "}
                  disputed ·{" "}
                  {breakingNews.filter(
                    (n) => n.confidenceLevel === "UNCONFIRMED",
                  ).length}{" "}
                  unconfirmed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Priority theaters + right sidebar ── */}
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title mb-0">Priority theaters</h2>
            <Link
              href="/conflicts"
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              View all conflicts
            </Link>
          </div>
          <div className="space-y-4">
            {activeConflicts.length ? (
              activeConflicts.map((conflict) => {
                const watched = isWatched("conflict", String(conflict.id));
                return (
                  <div
                    key={conflict.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--panel-muted)] p-5 hover:border-primary-500/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/conflicts/${conflict.id}`}
                        className="flex-1 min-w-0"
                      >
                        <h3 className="text-lg font-semibold text-[var(--foreground)] hover:text-primary-400">
                          {conflict.name}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {conflict.region}
                        </p>
                      </Link>
                      <div className="flex items-center gap-2">
                        {conflict.escalationTrend && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              conflict.escalationTrend === "ESCALATING"
                                ? "bg-red-500/20 text-red-400"
                                : conflict.escalationTrend === "DE_ESCALATING"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {conflict.escalationTrend === "ESCALATING"
                              ? "▲ Escalating"
                              : conflict.escalationTrend === "DE_ESCALATING"
                                ? "▼ De-escalating"
                                : "— Stable"}
                          </span>
                        )}
                        <span
                          className={`badge-${conflict.severity.toLowerCase()}`}
                        >
                          {conflict.severity}
                        </span>
                        <button
                          onClick={() =>
                            watched
                              ? removeFromWatchlist(
                                  "conflict",
                                  String(conflict.id),
                                )
                              : addToWatchlist({
                                  type: "conflict",
                                  id: String(conflict.id),
                                  name: conflict.name,
                                })
                          }
                          className="p-1 rounded hover:bg-yellow-500/10 transition-colors"
                          title={
                            watched
                              ? "Remove from watchlist"
                              : "Add to watchlist"
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${watched ? "fill-yellow-400 text-yellow-400" : "text-[var(--muted)]"}`}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                      {conflict.description}
                    </p>

                    {/* Why this matters */}
                    <div className="mt-3 rounded-lg border border-primary-500/20 bg-primary-500/5 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">
                        Why this matters
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted-strong)]">
                        {conflict.severity === "CRITICAL"
                          ? `Critical threat level with ${conflict.totalCasualties.toLocaleString()} casualties. ${conflict.participants.length} nations involved across ${conflict.region}.`
                          : `Active theater involving ${conflict.participants.length} nations. Monitoring for escalation signals and strategic shifts.`}
                        {conflict.trendDelta !== undefined &&
                          conflict.trendDelta > 0 &&
                          ` Casualty trend up ${conflict.trendDelta}% — escalation risk elevated.`}
                        {conflict.trendDelta !== undefined &&
                          conflict.trendDelta < 0 &&
                          ` Casualty trend down ${Math.abs(conflict.trendDelta)}% — potential stabilization.`}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                      {conflict.participants.map((participant) => (
                        <span
                          key={`${conflict.id}-${participant.isoCode}`}
                          className={`rounded-full border px-2.5 py-1 ${
                            participant.side === "AGGRESSOR" ||
                            (!participant.side &&
                              participant.role === "AGGRESSOR")
                              ? "border-red-500/30 text-red-400/80"
                              : participant.side === "DEFENDER" ||
                                  (!participant.side &&
                                    participant.role === "DEFENDER")
                                ? "border-blue-500/30 text-blue-400/80"
                                : "border-[var(--border)]"
                          }`}
                        >
                          {participant.countryName} ·{" "}
                          {participant.role === "ALLY" && participant.allyOf
                            ? `Ally of ${participant.allyOf}`
                            : participant.role}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center py-12 text-[var(--muted)]">
                <p className="text-sm">
                  No conflicts match the current filters.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* US-Iran Escalation Watch */}
          <div className="card border-red-500/20 bg-gradient-to-br from-red-500/10 via-[var(--panel)] to-[var(--background)]">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h2 className="section-title mb-0">
                US-Iran escalation watch
              </h2>
            </div>
            <div className="space-y-3">
              {breakingNews
                .filter((article) => {
                  const text =
                    `${article.title} ${article.content}`.toLowerCase();
                  return (
                    text.includes("iran") ||
                    text.includes("tehran") ||
                    text.includes("gulf") ||
                    text.includes("proxy")
                  );
                })
                .slice(0, 3)
                .map((article) => (
                  <a
                    key={article.id}
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border p-4 hover:border-red-400/40 bg-[var(--panel-muted)] border-[var(--border)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-[var(--foreground)]">
                        {article.title}
                      </p>
                      <ConfidenceBadge level={article.confidenceLevel} />
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {article.content}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
                      <span className="text-primary-400/70">
                        {getSourceTier(article.source)}
                      </span>
                      <span>· {article.source}</span>
                    </div>
                  </a>
                ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h2 className="section-title mb-0">Alerts</h2>
              </div>
              <StalenessIndicator
                iso={alerts[0]?.createdAt}
              />
            </div>
            <div className="space-y-3">
              {alerts.length ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--panel-muted)] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-[var(--foreground)]">
                        {alert.title}
                      </p>
                      <span
                        className={`badge-${alert.severity.toLowerCase()}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {alert.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-[var(--muted)]">
                    No active alerts yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent reporting with media enrichment */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary-400" />
                <h2 className="section-title mb-0">Recent reporting</h2>
              </div>
              <StalenessIndicator
                iso={breakingNews[0]?.publishedAt}
              />
            </div>
            <div className="space-y-4">
              {breakingNews.length ? (
                breakingNews.map((article) => (
                  <a
                    key={article.id}
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)] hover:border-primary-500/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {article.title}
                      </p>
                      <ConfidenceBadge level={article.confidenceLevel} />
                    </div>
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="mt-3 rounded-lg w-full h-32 object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
                      <span className="text-primary-400/70">
                        {getSourceTier(article.source)}
                      </span>
                      <span>· {article.source}</span>
                      <span>· {relativeTime(article.publishedAt)}</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-[var(--muted)]">
                    No recent reporting yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Map + Impact scoreboard ── */}
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-400" />
              <h2 className="section-title mb-0">Conflict map</h2>
            </div>
            <StalenessIndicator
              iso={recentEvents[0]?.eventDate}
            />
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
              history: conflict.casualtyHistory,
              escalationTrend: conflict.escalationTrend,
              trendDelta: conflict.trendDelta,
            }))}
          />
          <Link
            href="/countries"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300"
          >
            Explore country dashboards
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
