"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Users,
  DollarSign,
  Crosshair,
  Map,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type {
  Conflict,
  ConflictEvent,
  ConflictStat,
  HistoricalEvent,
  NewsArticle,
} from "@/lib/types";
import { CategoryBadge } from "@/components/shared/CategoryBadge";

const ConflictMap = dynamic(() => import("@/components/warroom/ConflictMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] rounded-2xl bg-[var(--panel-muted)] animate-pulse border border-[var(--border)]" />
  ),
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function ConfidenceBadge({ level }: { level: string }) {
  const tips: Record<string, string> = {
    VERIFIED: "Confirmed by 2+ independent sources",
    DISPUTED: "Sources conflict or information is contested",
    UNCONFIRMED: "Single-source, not yet corroborated",
  };
  return (
    <span
      className={`badge-${level.toLowerCase()} cursor-help`}
      title={tips[level] || level}
    >
      {level}
    </span>
  );
}

export default function ConflictDetail({
  conflict,
  events,
  stats,
  linkedEvents,
  relatedNews = [],
}: {
  conflict: Conflict;
  events: ConflictEvent[];
  stats: ConflictStat[];
  linkedEvents?: HistoricalEvent[];
  relatedNews?: NewsArticle[];
}) {
  const sparkData = conflict.casualtyHistory?.map((v) => ({ v }));
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
  );

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href="/conflicts"
            className="text-sm text-primary-400 hover:text-primary-300"
          >
            ← Back to conflicts
          </Link>
          <h1 className="mt-3 text-4xl font-bold text-[var(--foreground)]">
            {conflict.name}
          </h1>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">
            {conflict.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {conflict.escalationTrend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                conflict.escalationTrend === "ESCALATING"
                  ? "bg-red-500/20 text-red-400"
                  : conflict.escalationTrend === "DE_ESCALATING"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {conflict.escalationTrend === "ESCALATING" ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : conflict.escalationTrend === "DE_ESCALATING" ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
              {conflict.escalationTrend === "ESCALATING"
                ? "Escalating"
                : conflict.escalationTrend === "DE_ESCALATING"
                  ? "De-escalating"
                  : "Stable"}
              {conflict.trendDelta !== undefined && (
                <span>
                  {conflict.trendDelta > 0 ? " +" : " "}
                  {conflict.trendDelta}%
                </span>
              )}
            </span>
          )}
          <span className={`badge-${conflict.severity.toLowerCase()}`}>
            {conflict.severity}
          </span>
          <span className={`badge-${conflict.status.toLowerCase()}`}>
            {conflict.status}
          </span>
        </div>
      </div>

      {/* ── Key stats ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary-400 shrink-0" />
          <div>
            <p className="text-xs text-[var(--muted)]">Started</p>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {formatDate(conflict.startDate)}
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Users className="h-5 w-5 text-primary-400 shrink-0" />
          <div>
            <p className="text-xs text-[var(--muted)]">Participants</p>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {conflict.participants.length} nations
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Crosshair className="h-5 w-5 text-red-400 shrink-0" />
          <div>
            <p className="text-xs text-[var(--muted)]">Casualties</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {conflict.totalCasualties.toLocaleString()}
              </p>
              {conflict.trendDelta !== undefined && (
                <span
                  className={`text-[10px] font-medium ${conflict.trendDelta > 0 ? "text-red-400" : conflict.trendDelta < 0 ? "text-green-400" : "text-[var(--muted)]"}`}
                >
                  {conflict.trendDelta > 0 ? "▲" : "▼"}{" "}
                  {Math.abs(conflict.trendDelta)}%
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-orange-400 shrink-0" />
          <div>
            <p className="text-xs text-[var(--muted)]">Economic loss</p>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              ${(conflict.economicLossUsd / 1_000_000_000).toFixed(1)}B
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Map className="h-5 w-5 text-yellow-400 shrink-0" />
          <div>
            <p className="text-xs text-[var(--muted)]">Territory change</p>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {conflict.territoryChangeSqKm > 0
                ? `${conflict.territoryChangeSqKm.toLocaleString()} km²`
                : "No change"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Sparkline (if history) ── */}
      {sparkData && sparkData.length > 1 && (
        <section className="card">
          <h2 className="section-title">Casualty trend</h2>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={
                    conflict.escalationTrend === "ESCALATING"
                      ? "#f87171"
                      : conflict.escalationTrend === "DE_ESCALATING"
                        ? "#4ade80"
                        : "#facc15"
                  }
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* ── Participants + Map ── */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <h2 className="section-title">Participants</h2>

          <div className="space-y-4">
            {/* Aggressor side */}
            <div>
              <p className="text-xs uppercase tracking-wider text-red-400/70 mb-2">
                Aggressor side
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {conflict.participants
                  .filter(
                    (p) =>
                      p.side === "AGGRESSOR" ||
                      (!p.side && p.role === "AGGRESSOR"),
                  )
                  .map((participant) => (
                    <Link
                      key={participant.isoCode}
                      href={`/countries/${participant.isoCode}`}
                      className="rounded-xl border px-4 py-3 text-sm hover:border-primary-500/40 transition-colors bg-red-500/5 border-red-500/20"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-[var(--foreground)]">
                          {participant.countryName}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${participant.role === "AGGRESSOR" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}
                        >
                          {participant.role === "AGGRESSOR"
                            ? "LEAD"
                            : `ALLY OF ${participant.allyOf?.toUpperCase() ?? ""}`}
                        </span>
                      </div>
                      {participant.description && (
                        <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                          {participant.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-primary-400">
                        View profile →
                      </p>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Defender side */}
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-400/70 mb-2">
                Defender side
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {conflict.participants
                  .filter(
                    (p) =>
                      p.side === "DEFENDER" ||
                      (!p.side && p.role === "DEFENDER"),
                  )
                  .map((participant) => (
                    <Link
                      key={participant.isoCode}
                      href={`/countries/${participant.isoCode}`}
                      className="rounded-xl border px-4 py-3 text-sm hover:border-primary-500/40 transition-colors bg-blue-500/5 border-blue-500/20"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-[var(--foreground)]">
                          {participant.countryName}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${participant.role === "DEFENDER" ? "bg-blue-500/20 text-blue-400" : "bg-cyan-500/20 text-cyan-400"}`}
                        >
                          {participant.role === "DEFENDER"
                            ? "LEAD"
                            : `ALLY OF ${participant.allyOf?.toUpperCase() ?? ""}`}
                        </span>
                      </div>
                      {participant.description && (
                        <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                          {participant.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-primary-400">
                        View profile →
                      </p>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Mediators */}
            {conflict.participants.filter((p) => p.role === "MEDIATOR")
              .length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-green-400/70 mb-2">
                  Mediators
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {conflict.participants
                    .filter((p) => p.role === "MEDIATOR")
                    .map((participant) => (
                      <Link
                        key={participant.isoCode}
                        href={`/countries/${participant.isoCode}`}
                        className="rounded-xl border px-4 py-3 text-sm hover:border-primary-500/40 transition-colors bg-green-500/5 border-green-500/20"
                      >
                        <p className="font-medium text-[var(--foreground)]">
                          {participant.countryName}
                        </p>
                        {participant.description && (
                          <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                            {participant.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-primary-400">
                          View profile →
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="card">
          <h2 className="section-title">Operational map</h2>
          <ConflictMap events={events} />
        </div>
      </section>

      {/* ── Event timeline + Country impact ── */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Timeline */}
        <div className="card">
          <h2 className="section-title">Event timeline</h2>
          <div className="space-y-0">
            {sortedEvents.length ? (
              sortedEvents.map((event, idx) => (
                <div key={event.id} className="relative flex gap-4">
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full ring-2 shrink-0 mt-1.5 ${
                        event.confidenceLevel.toLowerCase() === "verified"
                          ? "bg-green-400 ring-green-400/30"
                          : event.confidenceLevel.toLowerCase() === "disputed"
                            ? "bg-yellow-400 ring-yellow-400/30"
                            : "bg-red-400 ring-red-400/30"
                      }`}
                    />
                    {idx < sortedEvents.length - 1 && (
                      <div className="w-px flex-1 bg-[var(--border)]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-6 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-primary-400">
                        {formatDate(event.eventDate)}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        · {event.eventType}
                      </span>
                      <ConfidenceBadge level={event.confidenceLevel} />
                    </div>
                    <p className="mt-1 font-medium text-[var(--foreground)]">
                      {event.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">
                      {event.description}
                    </p>
                    <p className="mt-1.5 text-xs text-[var(--muted)]">
                      Source: {event.source}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-[var(--muted)]">
                  No event entries available yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Country impact */}
        <div className="card">
          <h2 className="section-title">Country impact</h2>
          <div className="space-y-4">
            {stats.length ? (
              stats.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--panel-muted)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[var(--foreground)]">
                      {stat.countryName ?? "Aggregate"}
                    </p>
                    <ConfidenceBadge level={stat.confidenceLevel} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-[var(--muted)]">Casualties</p>
                      <p className="mt-1 text-[var(--foreground)] font-medium">
                        {stat.casualties.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">
                        Economic loss
                      </p>
                      <p className="mt-1 text-[var(--foreground)] font-medium">
                        ${(stat.economicLossUsd / 1_000_000_000).toFixed(1)}B
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">
                        Territory Δ
                      </p>
                      <p className="mt-1 text-[var(--foreground)] font-medium">
                        {stat.territoryChangeSqKm > 0
                          ? `${stat.territoryChangeSqKm.toLocaleString()} km²`
                          : "—"}
                      </p>
                    </div>
                  </div>
                  {/* Intensity bar */}
                  <div className="mt-3 h-2 rounded-full bg-[var(--background)]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300"
                      style={{
                        width: `${Math.min(100, Math.max(8, stat.casualties / 2000))}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-[var(--muted)]">
                  No impact stats available yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Related news ── */}
      {relatedNews.length > 0 && (
        <section className="card">
          <h2 className="section-title">Related news</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {relatedNews.map((article) => (
              <a
                key={article.id}
                href={article.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-[var(--border)] bg-[var(--panel-muted)] p-4 hover:border-primary-500/40 transition-colors"
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
                    className="mt-3 rounded-lg w-full h-28 object-cover"
                    loading="lazy"
                  />
                )}
                <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">
                  {article.content}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span>{article.source}</span>
                  <span>· {relativeTime(article.publishedAt)}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── Why this matters ── */}
      <section className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">
          Why this matters
        </h2>
        <p className="text-sm text-[var(--muted-strong)] leading-relaxed">
          {conflict.severity === "CRITICAL"
            ? `This conflict represents a critical threat level with ${conflict.totalCasualties.toLocaleString()} casualties and $${(conflict.economicLossUsd / 1_000_000_000).toFixed(1)}B in economic losses. ${conflict.participants.length} nations are directly involved across ${conflict.region}. `
            : `An active theater involving ${conflict.participants.length} nations in ${conflict.region}. `}
          {conflict.territoryChangeSqKm > 0 &&
            `Territorial changes of ${conflict.territoryChangeSqKm.toLocaleString()} km² have been recorded. `}
          {conflict.escalationTrend === "ESCALATING" &&
            `The conflict is currently escalating${conflict.trendDelta ? ` with casualties trending up ${conflict.trendDelta}%` : ""}. Close monitoring of escalation triggers and diplomatic channels is critical.`}
          {conflict.escalationTrend === "DE_ESCALATING" &&
            `The conflict shows signs of de-escalation${conflict.trendDelta ? ` with casualties trending down ${Math.abs(conflict.trendDelta)}%` : ""}. Continued diplomatic engagement may yield further stabilization.`}
          {conflict.escalationTrend === "STABLE" &&
            "The situation remains stable but warrants continued monitoring for any shifts in posture or rhetoric."}
          {!conflict.escalationTrend &&
            "Monitoring continues for escalation signals and strategic shifts."}
        </p>
      </section>

      {/* ── Historical context ── */}
      {linkedEvents && linkedEvents.length > 0 && (
        <section className="card">
          <h2 className="section-title">Historical context</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {linkedEvents.map((he) => (
              <Link
                key={he.id}
                href={`/events/${he.id}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--panel-muted)] p-4 hover:border-primary-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary-400 tabular-nums">
                    {he.year}
                    {he.endYear ? `–${he.endYear}` : ""}
                  </span>
                  <CategoryBadge category={he.category} />
                </div>
                <p className="mt-2 font-medium text-[var(--foreground)]">
                  {he.title}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">
                  {he.overview}
                </p>
                <p className="mt-2 text-xs text-primary-400">
                  Explore event →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
