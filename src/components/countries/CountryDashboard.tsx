"use client";

import Link from "next/link";
import type { CountryDashboard as CountryDashboardType, CountryRelation } from "@/lib/types";
import { useEffect, useState } from "react";
import { categoryConfig } from "@/components/shared/CategoryBadge";
import { Star } from "lucide-react";
import { useGeoPulseStore } from "@/lib/store";

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  source: string;
  sourceUrl?: string;
  confidenceLevel: string;
}

const RELATION_GROUP_ORDER = ["ALLY", "TRADE_PARTNER", "NEUTRAL", "RIVAL", "SANCTIONED"];

const relationGroupLabel: Record<string, string> = {
  ALLY: "Allies",
  TRADE_PARTNER: "Trade partners",
  NEUTRAL: "Neutral",
  RIVAL: "Rivals",
  SANCTIONED: "Sanctioned",
};

const relationGroupColor: Record<string, string> = {
  ALLY: "text-green-400",
  TRADE_PARTNER: "text-cyan-400",
  NEUTRAL: "text-[var(--muted)]",
  RIVAL: "text-orange-400",
  SANCTIONED: "text-red-400",
};

function relationTone(type: string) {
  if (type === "ALLY" || type === "TRADE_PARTNER") return "badge-low";
  if (type === "RIVAL" || type === "SANCTIONED") return "badge-high";
  return "badge-medium";
}

function formatTrendBadge(trend: string) {
  if (trend === "DECLINING") return "badge-high";
  if (trend === "IMPROVING") return "badge-low";
  return "badge-medium";
}

function groupRelations(
  relations: CountryRelation[],
): Record<string, CountryRelation[]> {
  const map: Record<string, CountryRelation[]> = {};
  for (const r of relations) {
    if (!map[r.relationType]) map[r.relationType] = [];
    map[r.relationType].push(r);
  }
  return map;
}

function dossierCard(title: string, content?: string, wide?: boolean) {
  return (
    <div
      className={`rounded-xl border p-5 bg-[var(--panel-muted)] border-[var(--border)] ${wide ? "lg:col-span-2" : ""}`}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted-strong)]">
        {content ?? "No intelligence entered yet."}
      </p>
    </div>
  );
}

const API_URL =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api"
    : "http://localhost:8080/api";

export default function CountryDashboard({
  dashboard,
}: {
  dashboard: CountryDashboardType;
}) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [timelineError, setTimelineError] = useState(false);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<number, boolean>>({});

  const { addToWatchlist, removeFromWatchlist, isWatched } = useGeoPulseStore();
  const watched = isWatched("country", dashboard.country.isoCode);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch(
          `${API_URL}/countries/${dashboard.country.id}/timeline`,
        );
        if (res.ok) {
          const data = await res.json();
          setTimeline(data);
        } else {
          setTimelineError(true);
        }
      } catch {
        setTimelineError(true);
      } finally {
        setLoadingTimeline(false);
      }
    };
    fetchTimeline();
  }, [dashboard.country.id]);

  // Derived stats
  const totalCasualties = dashboard.activeConflicts.reduce(
    (s, c) => s + c.totalCasualties,
    0,
  );
  const relationGroups = groupRelations(dashboard.relations);

  // Strategic watch: derive a meaningful section label from country's active conflicts/region
  const strategicWatchLabel = `Strategic watch — ${dashboard.country.name}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/countries"
          className="text-sm text-primary-400 hover:text-primary-300"
        >
          ← Back to countries
        </Link>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-4xl">{dashboard.country.flagUrl || "🌍"}</div>
            <div className="mt-3 flex items-center gap-3">
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                {dashboard.country.name}
              </h1>
              <button
                onClick={() => {
                  if (watched) {
                    removeFromWatchlist("country", dashboard.country.isoCode);
                  } else {
                    addToWatchlist({
                      type: "country",
                      id: dashboard.country.isoCode,
                      name: dashboard.country.name,
                    });
                  }
                }}
                className="p-1.5 rounded-full transition-colors hover:bg-[var(--panel-muted)]"
                title={watched ? "Unpin from watchlist" : "Pin to watchlist"}
              >
                <Star
                  className={`h-5 w-5 ${
                    watched ? "fill-yellow-400 text-yellow-400" : "text-[var(--muted)]"
                  }`}
                />
              </button>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">{dashboard.country.region}</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              {dashboard.profile?.summary ?? "No summary available yet."}
            </p>
          </div>
          <span className={formatTrendBadge(dashboard.economy.trend)}>
            {dashboard.economy.trend}
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {dashboard.activeConflicts.length}
          </p>
          <p className="text-xs text-[var(--muted)]">Active conflicts</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {totalCasualties.toLocaleString()}
          </p>
          <p className="text-xs text-[var(--muted)]">Total casualties</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            ${(dashboard.economy.totalEconomicLoss / 1_000_000_000).toFixed(1)}B
          </p>
          <p className="text-xs text-[var(--muted)]">Economic exposure</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {dashboard.relations.length}
          </p>
          <p className="text-xs text-[var(--muted)]">Tracked relations</p>
        </div>
      </div>

      {/* Key profile cards */}
      <section className="grid gap-6 lg:grid-cols-4">
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Political system</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">
            {dashboard.profile?.politicalSystem ?? "Unknown"}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Leadership</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">
            {dashboard.profile?.currentLeadership ?? "Unknown"}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">GDP</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">
            ${(dashboard.economy.gdpUsd / 1_000_000_000).toFixed(0)}B
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Military profile</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">
            {dashboard.profile?.militaryStrength ?? "Unknown"}
          </p>
        </div>
      </section>

      {/* Historical dossier */}
      <section className="card">
        <h2 className="section-title">Historical dossier</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {dossierCard("War history", dashboard.profile?.warHistory)}
          {dossierCard("Conflict record", dashboard.profile?.conflictRecord)}
          {dossierCard(
            "Strategic and nuclear programs",
            dashboard.profile?.strategicPrograms,
            true,
          )}
          {dossierCard(
            "Intelligence assessment",
            dashboard.profile?.intelligenceAssessment,
            true,
          )}
        </div>
      </section>

      {/* Key historical milestones */}
      {dashboard.historicalMilestones?.length > 0 && (
        <section className="card">
          <h2 className="section-title">Key historical milestones</h2>
          <div className="relative space-y-0 before:absolute before:left-[19px] before:top-4 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-gradient-to-b before:from-primary-500/40 before:via-[var(--border)] before:to-transparent">
            {[...dashboard.historicalMilestones]
              .sort((a, b) => a.year - b.year)
              .map((milestone) => {
                const cat =
                  categoryConfig[milestone.category] ?? categoryConfig.WAR;
                const cardContent = (
                  <>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-2xl font-bold text-primary-400 tabular-nums">
                        {milestone.year}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cat.color}`}
                      >
                        {cat.icon} {cat.label}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-[var(--foreground)]">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">
                      {milestone.description}
                    </p>

                    {milestone.references.length > 0 && (
                      <div className="mt-4 border-t border-[var(--border)] pt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
                          References
                        </p>
                        <ul className="space-y-1">
                          {milestone.references.map((ref, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs">
                              <span className="mt-0.5 text-primary-400 shrink-0">›</span>
                              <span>
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary-400 hover:text-primary-300 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {ref.title}
                                </a>
                                <span className="text-[var(--muted)]">
                                  {" "}
                                  — {ref.source}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </>
                );

                const isExpanded = expandedMilestones[milestone.id] ?? false;

                return (
                  <div key={milestone.id} className="relative pl-12 pb-8 last:pb-0">
                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[var(--panel)] bg-[var(--panel-muted)] text-lg shadow">
                      {cat.icon}
                    </div>
                    {milestone.eventId ? (
                      <Link
                        href={`/events/${milestone.eventId}`}
                        className="block rounded-xl border p-5 bg-[var(--panel-muted)] border-[var(--border)] hover:border-primary-500/40 transition-colors"
                      >
                        {cardContent}
                        <p className="mt-3 text-xs font-medium text-primary-400">
                          View full event detail →
                        </p>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMilestones((prev) => ({
                            ...prev,
                            [milestone.id]: !prev[milestone.id],
                          }))
                        }
                        className="block w-full text-left rounded-xl border p-5 bg-[var(--panel-muted)] border-[var(--border)] hover:border-primary-500/40 transition-colors"
                      >
                        {cardContent}
                        <p className="mt-3 text-xs font-medium text-primary-400">
                          {isExpanded ? "Hide sources ↑" : "View sources & detail ↓"}
                        </p>
                        {isExpanded && (
                          <div className="mt-4 border-t border-[var(--border)] pt-4 space-y-3">
                            {milestone.references.length > 0 ? (
                              <>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                                  Primary sources
                                </p>
                                <ul className="space-y-2">
                                  {milestone.references.map((ref, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                      <span className="mt-0.5 text-primary-400 shrink-0">›</span>
                                      <span>
                                        <a
                                          href={ref.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-primary-400 hover:text-primary-300 hover:underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {ref.title}
                                        </a>
                                        <span className="text-[var(--muted)]">
                                          {" "}— {ref.source}
                                        </span>
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <p className="text-xs text-[var(--muted)]">
                                No source references recorded for this milestone.
                              </p>
                            )}
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Strategic snapshot */}
          <div className="card">
            <h2 className="section-title">Strategic snapshot</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                <p className="text-sm text-[var(--muted)]">Population</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {dashboard.profile?.population
                    ? `${(dashboard.profile.population / 1_000_000).toFixed(0)}M`
                    : "Unknown"}
                </p>
              </div>
              <div className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                <p className="text-sm text-[var(--muted)]">Active conflicts</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {dashboard.economy.activeConflicts}
                </p>
              </div>
              <div className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                <p className="text-sm text-[var(--muted)]">Economic exposure</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  ${(dashboard.economy.totalEconomicLoss / 1_000_000_000).toFixed(1)}B
                </p>
              </div>
            </div>
          </div>

          {/* Active conflicts */}
          <div className="card">
            <h2 className="section-title">Active conflicts</h2>
            <div className="space-y-4">
              {dashboard.activeConflicts.length ? (
                dashboard.activeConflicts.map((conflict) => (
                  <div
                    key={conflict.id}
                    className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]"
                  >
                    <Link
                      href={`/conflicts/${conflict.id}`}
                      className="block hover:text-primary-400"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-[var(--foreground)]">
                          {conflict.name}
                        </p>
                        <span className={`badge-${conflict.severity.toLowerCase()}`}>
                          {conflict.severity}
                        </span>
                      </div>
                    </Link>
                    {conflict.participants && conflict.participants.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-red-400/70 w-full">
                            Aggressor side
                          </span>
                          {conflict.participants
                            .filter(
                              (p) =>
                                p.side === "AGGRESSOR" ||
                                (!p.side && p.role === "AGGRESSOR"),
                            )
                            .map((p) => (
                              <span
                                key={p.countryId}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                                  p.role === "AGGRESSOR"
                                    ? "bg-red-500/15 text-red-400 border-red-500/20"
                                    : "bg-orange-500/15 text-orange-400 border-orange-500/20"
                                }`}
                              >
                                {p.role === "AGGRESSOR" ? "⚔" : "🤝"}{" "}
                                {p.countryName}
                                {p.allyOf ? ` (ally of ${p.allyOf})` : ""}
                              </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-blue-400/70 w-full">
                            Defender side
                          </span>
                          {conflict.participants
                            .filter(
                              (p) =>
                                p.side === "DEFENDER" ||
                                (!p.side && p.role === "DEFENDER"),
                            )
                            .map((p) => (
                              <span
                                key={p.countryId}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                                  p.role === "DEFENDER"
                                    ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                                    : "bg-cyan-500/15 text-cyan-400 border-cyan-500/20"
                                }`}
                              >
                                {p.role === "DEFENDER" ? "🛡" : "🤝"}{" "}
                                {p.countryName}
                                {p.allyOf ? ` (ally of ${p.allyOf})` : ""}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                    <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                      {conflict.description ?? "Conflict summary pending."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  No directly linked active conflict in the current dataset.
                </p>
              )}
            </div>
          </div>

          {/* Historical conflicts */}
          <div className="card">
            <h2 className="section-title">Historical conflicts</h2>
            <div className="space-y-4">
              {dashboard.historicalConflicts.length ? (
                dashboard.historicalConflicts.map((conflict) => (
                  <div
                    key={conflict.id}
                    className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-[var(--foreground)]">
                        {conflict.name}
                      </p>
                      <span className={`badge-${conflict.status.toLowerCase()}`}>
                        {conflict.status}
                      </span>
                    </div>
                    {conflict.participants && conflict.participants.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-red-400/70 w-full">
                            Aggressor side
                          </span>
                          {conflict.participants
                            .filter(
                              (p) =>
                                p.side === "AGGRESSOR" ||
                                (!p.side && p.role === "AGGRESSOR"),
                            )
                            .map((p) => (
                              <span
                                key={p.countryId}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                                  p.role === "AGGRESSOR"
                                    ? "bg-red-500/15 text-red-400 border-red-500/20"
                                    : "bg-orange-500/15 text-orange-400 border-orange-500/20"
                                }`}
                              >
                                {p.countryName}
                              </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-blue-400/70 w-full">
                            Defender side
                          </span>
                          {conflict.participants
                            .filter(
                              (p) =>
                                p.side === "DEFENDER" ||
                                (!p.side && p.role === "DEFENDER"),
                            )
                            .map((p) => (
                              <span
                                key={p.countryId}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                                  p.role === "DEFENDER"
                                    ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                                    : "bg-cyan-500/15 text-cyan-400 border-cyan-500/20"
                                }`}
                              >
                                {p.countryName}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                    <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                      {conflict.description ?? "Historical record pending."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  No archived conflict records linked yet.
                </p>
              )}
            </div>
          </div>

          {/* Recent news */}
          <div className="card">
            <h2 className="section-title">Recent news and sources</h2>
            <div className="space-y-4">
              {dashboard.recentNews.length ? (
                dashboard.recentNews.map((article) => (
                  <a
                    key={article.id}
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border p-4 hover:border-primary-500/40 bg-[var(--panel-muted)] border-[var(--border)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-[var(--foreground)]">
                        {article.title}
                      </p>
                      <span
                        className={`badge-${article.confidenceLevel.toLowerCase()}`}
                      >
                        {article.confidenceLevel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {article.content}
                    </p>
                    <p className="mt-3 text-xs text-[var(--muted)]">
                      Source: {article.source}
                    </p>
                  </a>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  No recent news available.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Strategic watch — dynamic label */}
          {dashboard.strategicWatch.length > 0 && (
            <div className="card">
              <h2 className="section-title">{strategicWatchLabel}</h2>
              <div className="space-y-4">
                {dashboard.strategicWatch.map((article) => (
                  <a
                    key={article.id}
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border p-4 hover:border-primary-500/40 bg-[var(--panel-muted)] border-[var(--border)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-[var(--foreground)]">
                        {article.title}
                      </p>
                      <span className="badge-high shrink-0">Watch</span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {article.content}
                    </p>
                    <p className="mt-3 text-xs text-[var(--muted)]">
                      {article.source}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Relations — grouped by type */}
          <div className="card">
            <h2 className="section-title">Relations</h2>
            {dashboard.relations.length ? (
              <div className="space-y-6">
                {RELATION_GROUP_ORDER.filter(
                  (type) => relationGroups[type]?.length,
                ).map((type) => (
                  <div key={type}>
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider mb-3 ${relationGroupColor[type]}`}
                    >
                      {relationGroupLabel[type]}
                    </p>
                    <div className="space-y-3">
                      {relationGroups[type].map((relation) => (
                        <div
                          key={relation.id}
                          className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-[var(--foreground)]">
                              {relation.relatedCountryName}
                            </p>
                            <span className={relationTone(relation.relationType)}>
                              {relation.relationType.replace("_", " ")}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-[var(--muted)]">
                            {relation.description}
                          </p>
                          <div className="mt-3">
                            <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted)]">
                              <span>Relationship intensity</span>
                              <span>{relation.strength}/10</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-700/50">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-cyan-400"
                                style={{ width: `${Number(relation.strength) * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Relations mapping is only partially seeded.
              </p>
            )}
          </div>

          {/* Analysis videos with thumbnails */}
          <div className="card">
            <h2 className="section-title">Analysis videos</h2>
            <div className="space-y-4">
              {dashboard.videos.length ? (
                dashboard.videos.map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex gap-3 rounded-xl border p-3 hover:border-primary-500/40 bg-[var(--panel-muted)] border-[var(--border)] transition-colors"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeVideoId}/mqdefault.jpg`}
                      alt={video.title}
                      loading="lazy"
                      className="w-24 h-16 rounded-lg object-cover shrink-0 bg-[var(--panel)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-[var(--foreground)] text-sm leading-snug line-clamp-2">
                          {video.title}
                        </p>
                        <span className="badge-low shrink-0 text-[10px]">
                          {video.duration}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted)] line-clamp-2">
                        {video.description}
                      </p>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {video.channelName}
                      </p>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  No tagged analysis videos yet.
                </p>
              )}
            </div>
          </div>

          {/* Chronological Intelligence Timeline */}
          <div className="card">
            <h2 className="section-title">Chronological intelligence timeline</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border)] before:to-transparent">
              {loadingTimeline ? (
                <p className="text-sm text-[var(--muted)] text-center py-4">
                  Loading timeline feed...
                </p>
              ) : timelineError || timeline.length === 0 ? (
                <p className="text-sm text-[var(--muted)] text-center py-4">
                  {timelineError
                    ? "Timeline feed unavailable — backend offline."
                    : "No timeline events recorded."}
                </p>
              ) : (
                timeline.map((event) => (
                  <div
                    key={event.id}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--panel)] bg-[var(--panel-muted)] text-primary-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      {event.type === "NEWS" ? "📰" : "⚔️"}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--border)] bg-[var(--panel-muted)] shadow">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-semibold uppercase ${
                            event.type === "NEWS"
                              ? "text-cyan-400"
                              : "text-red-400"
                          }`}
                        >
                          {event.type === "NEWS"
                            ? "Intelligence Report"
                            : "Conflict Event"}
                        </span>
                        <time className="text-xs text-[var(--muted)]">
                          {new Date(event.date).toLocaleDateString()}
                        </time>
                      </div>
                      <h3 className="font-bold text-[var(--foreground)] mt-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-[var(--muted)] mt-2 leading-tight">
                        {event.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-[var(--muted-strong)]">
                          Source: {event.source}
                        </span>
                        <span
                          className={`badge-${event.confidenceLevel.toLowerCase()}`}
                        >
                          {event.confidenceLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
