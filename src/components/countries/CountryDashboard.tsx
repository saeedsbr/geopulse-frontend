"use client";

import Link from "next/link";
import type { CountryDashboard as CountryDashboardType } from "@/lib/types";
import { useEffect, useState } from "react";
import { categoryConfig } from "@/components/shared/CategoryBadge";

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

function dossierCard(title: string, content?: string) {
  return (
    <div className="rounded-xl border p-5 bg-[var(--panel-muted)] border-[var(--border)]">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted-strong)]">{content ?? "No intelligence entered yet."}</p>
    </div>
  );
}

export default function CountryDashboard({ dashboard }: { dashboard: CountryDashboardType }) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/countries/${dashboard.country.id}/timeline`);
        if (res.ok) {
          const data = await res.json();
          setTimeline(data);
        }
      } catch (err) {
        console.error("Failed to fetch timeline:", err);
      } finally {
        setLoadingTimeline(false);
      }
    };
    fetchTimeline();
  }, [dashboard.country.id]);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/countries" className="text-sm text-primary-400 hover:text-primary-300">
          ← Back to countries
        </Link>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-4xl">{dashboard.country.flagUrl || "🌍"}</div>
            <h1 className="mt-3 text-4xl font-bold text-[var(--foreground)]">{dashboard.country.name}</h1>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">{dashboard.profile?.summary ?? "No summary available yet."}</p>
          </div>
          <span className={formatTrendBadge(dashboard.economy.trend)}>{dashboard.economy.trend}</span>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-4">
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Political system</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">{dashboard.profile?.politicalSystem ?? "Unknown"}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Leadership</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">{dashboard.profile?.currentLeadership ?? "Unknown"}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">GDP</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">${(dashboard.economy.gdpUsd / 1_000_000_000).toFixed(0)}B</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Military profile</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">{dashboard.profile?.militaryStrength ?? "Unknown"}</p>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Historical dossier</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {dossierCard("War history", dashboard.profile?.warHistory)}
          {dossierCard("Conflict record", dashboard.profile?.conflictRecord)}
          {dossierCard("Strategic and nuclear programs", dashboard.profile?.strategicPrograms)}
          {dossierCard("Intelligence assessment", dashboard.profile?.intelligenceAssessment)}
        </div>
      </section>

      {dashboard.historicalMilestones?.length > 0 && (
        <section className="card">
          <h2 className="section-title">Key historical milestones</h2>
          <div className="relative space-y-0 before:absolute before:left-[19px] before:top-4 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-gradient-to-b before:from-primary-500/40 before:via-[var(--border)] before:to-transparent">
            {dashboard.historicalMilestones
              .sort((a, b) => a.year - b.year)
              .map((milestone) => {
                const cat = categoryConfig[milestone.category] ?? categoryConfig.WAR;
                return (
                  <div key={milestone.id} className="relative pl-12 pb-8 last:pb-0">
                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[var(--panel)] bg-[var(--panel-muted)] text-lg shadow">
                      {cat.icon}
                    </div>

                    {(() => {
                      const cardContent = (
                        <>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-2xl font-bold text-primary-400 tabular-nums">{milestone.year}</span>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cat.color}`}>
                              {cat.icon} {cat.label}
                            </span>
                          </div>
                          <h3 className="mt-2 text-base font-semibold text-[var(--foreground)]">{milestone.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">{milestone.description}</p>

                          {milestone.references.length > 0 && (
                            <div className="mt-4 border-t border-[var(--border)] pt-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">References</p>
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
                                      <span className="text-[var(--muted)]"> — {ref.source}</span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {milestone.eventId && (
                            <p className="mt-3 text-xs font-medium text-primary-400">View full event detail →</p>
                          )}
                        </>
                      );

                      return milestone.eventId ? (
                        <Link
                          href={`/events/${milestone.eventId}`}
                          className="block rounded-xl border p-5 bg-[var(--panel-muted)] border-[var(--border)] hover:border-primary-500/40 transition-colors"
                        >
                          {cardContent}
                        </Link>
                      ) : (
                        <div className="rounded-xl border p-5 bg-[var(--panel-muted)] border-[var(--border)]">
                          {cardContent}
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="card">
            <h2 className="section-title">Strategic snapshot</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                <p className="text-sm text-[var(--muted)]">Population</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  {dashboard.profile?.population ? `${(dashboard.profile.population / 1_000_000).toFixed(0)}M` : "Unknown"}
                </p>
              </div>
              <div className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                <p className="text-sm text-[var(--muted)]">Active conflicts</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{dashboard.economy.activeConflicts}</p>
              </div>
              <div className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                <p className="text-sm text-[var(--muted)]">Economic exposure</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">${(dashboard.economy.totalEconomicLoss / 1_000_000_000).toFixed(1)}B</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Active conflicts</h2>
            <div className="space-y-4">
              {dashboard.activeConflicts.length ? (
                dashboard.activeConflicts.map((conflict) => (
                  <div key={conflict.id} className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                    <Link href={`/conflicts/${conflict.id}`} className="block hover:text-primary-400">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-[var(--foreground)]">{conflict.name}</p>
                        <span className={`badge-${conflict.severity.toLowerCase()}`}>{conflict.severity}</span>
                      </div>
                    </Link>
                    {conflict.participants && conflict.participants.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-red-400/70 w-full">Aggressor side</span>
                          {conflict.participants.filter(p => p.side === 'AGGRESSOR' || (!p.side && p.role === 'AGGRESSOR')).map(p => (
                            <span key={p.countryId} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${p.role === 'AGGRESSOR' ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-orange-500/15 text-orange-400 border-orange-500/20'}`}>
                              {p.role === 'AGGRESSOR' ? '⚔' : '🤝'} {p.countryName}{p.allyOf ? ` (ally of ${p.allyOf})` : ''}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-blue-400/70 w-full">Defender side</span>
                          {conflict.participants.filter(p => p.side === 'DEFENDER' || (!p.side && p.role === 'DEFENDER')).map(p => (
                            <span key={p.countryId} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${p.role === 'DEFENDER' ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'}`}>
                              {p.role === 'DEFENDER' ? '🛡' : '🤝'} {p.countryName}{p.allyOf ? ` (ally of ${p.allyOf})` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{conflict.description ?? "Conflict summary pending."}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No directly linked active conflict in the current dataset.</p>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Historical conflicts</h2>
            <div className="space-y-4">
              {dashboard.historicalConflicts.length ? dashboard.historicalConflicts.map((conflict) => (
                <div key={conflict.id} className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-[var(--foreground)]">{conflict.name}</p>
                    <span className={`badge-${conflict.status.toLowerCase()}`}>{conflict.status}</span>
                  </div>
                  {conflict.participants && conflict.participants.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-red-400/70 w-full">Aggressor side</span>
                        {conflict.participants.filter(p => p.side === 'AGGRESSOR' || (!p.side && p.role === 'AGGRESSOR')).map(p => (
                          <span key={p.countryId} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${p.role === 'AGGRESSOR' ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-orange-500/15 text-orange-400 border-orange-500/20'}`}>
                            {p.role === 'AGGRESSOR' ? '⚔' : '🤝'} {p.countryName}{p.allyOf ? ` (ally of ${p.allyOf})` : ''}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-blue-400/70 w-full">Defender side</span>
                        {conflict.participants.filter(p => p.side === 'DEFENDER' || (!p.side && p.role === 'DEFENDER')).map(p => (
                          <span key={p.countryId} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${p.role === 'DEFENDER' ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'}`}>
                            {p.role === 'DEFENDER' ? '🛡' : '🤝'} {p.countryName}{p.allyOf ? ` (ally of ${p.allyOf})` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{conflict.description ?? "Historical record pending."}</p>
                </div>
              )) : <p className="text-sm text-[var(--muted)]">No archived conflict records linked yet.</p>}
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Recent news and sources</h2>
            <div className="space-y-4">
              {dashboard.recentNews.length ? dashboard.recentNews.map((article) => (
                <a key={article.id} href={article.sourceUrl} target="_blank" rel="noreferrer" className="block rounded-xl border p-4 hover:border-primary-500/40 bg-[var(--panel-muted)] border-[var(--border)]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-[var(--foreground)]">{article.title}</p>
                    <span className={`badge-${article.confidenceLevel.toLowerCase()}`}>{article.confidenceLevel}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{article.content}</p>
                  <p className="mt-3 text-xs text-[var(--muted)]">Source: {article.source}</p>
                </a>
              )) : <p className="text-sm text-[var(--muted)]">No recent news available.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="section-title">US-Iran watch</h2>
            <div className="space-y-4">
              {dashboard.strategicWatch.length ? dashboard.strategicWatch.map((article) => (
                <a key={article.id} href={article.sourceUrl} target="_blank" rel="noreferrer" className="block rounded-xl border p-4 hover:border-primary-500/40 bg-[var(--panel-muted)] border-[var(--border)]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[var(--foreground)]">{article.title}</p>
                    <span className="badge-high">Watch</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{article.content}</p>
                  <p className="mt-3 text-xs text-[var(--muted)]">{article.source}</p>
                </a>
              )) : <p className="text-sm text-[var(--muted)]">No US-Iran related watch items for this country yet.</p>}
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Relations</h2>
            <div className="space-y-4">
              {dashboard.relations.length ? (
                dashboard.relations.map((relation) => (
                  <div key={relation.id} className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-[var(--foreground)]">{relation.relatedCountryName}</p>
                      <span className={relationTone(relation.relationType)}>{relation.relationType}</span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{relation.description}</p>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted)]">
                        <span>Relationship intensity</span>
                        <span>{relation.strength}/10</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-700/50">
                        <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-cyan-400" style={{ width: `${Number(relation.strength) * 10}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">Relations mapping is only partially seeded.</p>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Analysis videos</h2>
            <div className="space-y-4">
              {dashboard.videos.length ? dashboard.videos.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border p-4 hover:border-primary-500/40 bg-[var(--panel-muted)] border-[var(--border)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[var(--foreground)]">{video.title}</p>
                    <span className="badge-low">{video.duration}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{video.description}</p>
                  <p className="mt-3 text-xs text-[var(--muted)]">{video.channelName}</p>
                </a>
              )) : <p className="text-sm text-[var(--muted)]">No tagged analysis videos yet.</p>}
            </div>
          </div>
          <div className="card lg:col-span-2">
            <h2 className="section-title">Chronological Intelligence Timeline</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border)] before:to-transparent">
              {loadingTimeline ? (
                <p className="text-sm text-[var(--muted)] text-center py-4">Loading timeline feed...</p>
              ) : timeline.length > 0 ? (
                timeline.map((event, i) => (
                  <div key={event.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--panel)] bg-[var(--panel-muted)] text-primary-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      {event.type === 'NEWS' ? '📰' : '⚔️'}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--border)] bg-[var(--panel-muted)] shadow">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold uppercase ${event.type === 'NEWS' ? 'text-cyan-400' : 'text-red-400'}`}>
                          {event.type === 'NEWS' ? 'Intelligence Report' : 'Conflict Event'}
                        </span>
                        <time className="text-xs text-[var(--muted)]">{new Date(event.date).toLocaleDateString()}</time>
                      </div>
                      <h3 className="font-bold text-[var(--foreground)] mt-1">{event.title}</h3>
                      <p className="text-sm text-[var(--muted)] mt-2 leading-tight">{event.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-[var(--muted-strong)]">Source: {event.source}</span>
                        <span className={`badge-${event.confidenceLevel.toLowerCase()}`}>{event.confidenceLevel}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)] text-center py-4">No timeline events recorded.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
