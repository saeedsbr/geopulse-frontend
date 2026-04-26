import Link from "next/link";
import type { Conflict, HistoricalEvent } from "@/lib/types";
import { CategoryBadge } from "@/components/shared/CategoryBadge";

const roleColor: Record<string, string> = {
  PRIMARY: "text-red-400 bg-red-500/15 border-red-500/20",
  OPPONENT: "text-orange-400 bg-orange-500/15 border-orange-500/20",
  ALLY: "text-amber-400 bg-amber-500/15 border-amber-500/20",
  MEDIATOR: "text-blue-400 bg-blue-500/15 border-blue-500/20",
  AFFECTED: "text-slate-400 bg-slate-500/15 border-slate-500/20",
  SECONDARY: "text-cyan-400 bg-cyan-500/15 border-cyan-500/20",
};

const significanceStyle: Record<string, string> = {
  DEFINING: "badge-critical",
  MAJOR: "badge-high",
  NOTABLE: "badge-medium",
};

export default function EventDetail({
  event,
  linkedConflicts,
  linkedEvents,
}: {
  event: HistoricalEvent;
  linkedConflicts: Conflict[];
  linkedEvents: HistoricalEvent[];
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/events" className="text-sm text-primary-400 hover:text-primary-300">
          ← Back to events
        </Link>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-primary-400 tabular-nums">
                {event.year}{event.endYear ? `–${event.endYear}` : ""}
              </span>
              <CategoryBadge category={event.category} />
              <span className={significanceStyle[event.significance] ?? "badge-medium"}>
                {event.significance}
              </span>
            </div>
            <h1 className="mt-3 text-4xl font-bold text-[var(--foreground)]">{event.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{event.region}</p>
          </div>
        </div>
      </div>

      {/* Intelligence Briefing */}
      <section className="card">
        <h2 className="section-title">Intelligence briefing</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border p-5 bg-[var(--panel-muted)] border-[var(--border)]">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">Overview</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-strong)]">{event.overview}</p>
          </div>
          <div className="rounded-xl border p-5 bg-[var(--panel-muted)] border-[var(--border)]">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">Causes</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-strong)]">{event.causes}</p>
          </div>
          <div className="rounded-xl border p-5 bg-[var(--panel-muted)] border-[var(--border)]">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-400">Outcome</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-strong)]">{event.outcome}</p>
          </div>
        </div>
      </section>

      {/* Participants */}
      <section className="card">
        <h2 className="section-title">Participants</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {event.participants.map((p) => {
            const rc = roleColor[p.role] ?? roleColor.AFFECTED;
            return (
              <Link
                key={p.isoCode}
                href={`/countries/${p.isoCode}`}
                className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)] hover:border-primary-500/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-[var(--foreground)]">{p.countryName}</p>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${rc}`}>
                    {p.role}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted-strong)]">{p.description}</p>
                <p className="mt-3 text-xs text-primary-400">View country profile →</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Event Timeline */}
      {event.timeline.length > 0 && (
        <section className="card">
          <h2 className="section-title">Event timeline</h2>
          <div className="relative space-y-0 before:absolute before:left-[19px] before:top-4 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-gradient-to-b before:from-primary-500/40 before:via-[var(--border)] before:to-transparent">
            {event.timeline.map((entry, i) => (
              <div key={i} className="relative pl-12 pb-6 last:pb-0">
                <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[var(--panel)] bg-[var(--panel-muted)] text-xs font-bold text-primary-400 shadow">
                  {i + 1}
                </div>
                <div className="rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)]">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-[var(--foreground)]">{entry.title}</h3>
                    <time className="text-xs text-[var(--muted)] shrink-0">{entry.date}</time>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted-strong)] leading-relaxed">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Connected Intelligence */}
      {(linkedConflicts.length > 0 || linkedEvents.length > 0) && (
        <section className="grid gap-6 lg:grid-cols-2">
          {linkedConflicts.length > 0 && (
            <div className="card">
              <h2 className="section-title">Related conflicts</h2>
              <div className="space-y-4">
                {linkedConflicts.map((conflict) => (
                  <Link
                    key={conflict.id}
                    href={`/conflicts/${conflict.id}`}
                    className="block rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)] hover:border-primary-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-[var(--foreground)]">{conflict.name}</p>
                      <div className="flex gap-2">
                        <span className={`badge-${conflict.severity.toLowerCase()}`}>{conflict.severity}</span>
                        <span className={`badge-${conflict.status.toLowerCase()}`}>{conflict.status}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted-strong)]">{conflict.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {linkedEvents.length > 0 && (
            <div className="card">
              <h2 className="section-title">Related events</h2>
              <div className="space-y-4">
                {linkedEvents.map((linked) => (
                  <Link
                    key={linked.id}
                    href={`/events/${linked.id}`}
                    className="block rounded-xl border p-4 bg-[var(--panel-muted)] border-[var(--border)] hover:border-primary-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary-400 tabular-nums">{linked.year}</span>
                        <CategoryBadge category={linked.category} />
                      </div>
                    </div>
                    <p className="mt-2 font-medium text-[var(--foreground)]">{linked.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted-strong)] line-clamp-2">{linked.overview}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* References */}
      {event.references.length > 0 && (
        <section className="card">
          <h2 className="section-title">References and sources</h2>
          <ul className="space-y-2">
            {event.references.map((ref, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-primary-400 shrink-0">›</span>
                <span>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-400 hover:text-primary-300 hover:underline"
                  >
                    {ref.title}
                  </a>
                  <span className="text-[var(--muted)]"> — {ref.source}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
