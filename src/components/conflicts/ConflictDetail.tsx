import Link from "next/link";
import type { Conflict, ConflictEvent, ConflictStat, HistoricalEvent } from "@/lib/types";
import { CategoryBadge } from "@/components/shared/CategoryBadge";

export default function ConflictDetail({
  conflict,
  events,
  stats,
  linkedEvents,
}: {
  conflict: Conflict;
  events: ConflictEvent[];
  stats: ConflictStat[];
  linkedEvents?: HistoricalEvent[];
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/conflicts" className="text-sm text-primary-400 hover:text-primary-300">
            ← Back to conflicts
          </Link>
          <h1 className="mt-3 text-4xl font-bold text-white">{conflict.name}</h1>
          <p className="mt-3 max-w-3xl text-dark-300">{conflict.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`badge-${conflict.severity.toLowerCase()}`}>{conflict.severity}</span>
          <span className={`badge-${conflict.status.toLowerCase()}`}>{conflict.status}</span>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <h2 className="section-title">Operational picture</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-dark-950/70 p-4">
              <p className="text-sm text-dark-500">Started</p>
              <p className="mt-2 text-lg font-semibold text-white">{conflict.startDate}</p>
            </div>
            <div className="rounded-xl bg-dark-950/70 p-4">
              <p className="text-sm text-dark-500">Casualties</p>
              <p className="mt-2 text-lg font-semibold text-white">{conflict.totalCasualties.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-dark-950/70 p-4">
              <p className="text-sm text-dark-500">Economic loss</p>
              <p className="mt-2 text-lg font-semibold text-white">${(conflict.economicLossUsd / 1_000_000_000).toFixed(1)}B</p>
            </div>
          </div>

          <h3 className="mt-6 text-lg font-semibold text-white">Participants</h3>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-red-400/70 mb-2">Aggressor side</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {conflict.participants.filter(p => p.side === 'AGGRESSOR' || (!p.side && p.role === 'AGGRESSOR')).map((participant) => (
                  <Link
                    key={participant.isoCode}
                    href={`/countries/${participant.isoCode}`}
                    className="rounded-xl border px-4 py-3 text-sm hover:border-primary-500/40 transition-colors bg-red-500/5 border-red-500/20"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-white">{participant.countryName}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${participant.role === 'AGGRESSOR' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {participant.role === 'AGGRESSOR' ? 'LEAD' : `ALLY OF ${participant.allyOf?.toUpperCase() ?? ''}`}
                      </span>
                    </div>
                    {participant.description && <p className="mt-1.5 text-xs text-dark-400 leading-relaxed">{participant.description}</p>}
                    <p className="mt-2 text-xs text-primary-400">View profile →</p>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-blue-400/70 mb-2">Defender side</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {conflict.participants.filter(p => p.side === 'DEFENDER' || (!p.side && p.role === 'DEFENDER')).map((participant) => (
                  <Link
                    key={participant.isoCode}
                    href={`/countries/${participant.isoCode}`}
                    className="rounded-xl border px-4 py-3 text-sm hover:border-primary-500/40 transition-colors bg-blue-500/5 border-blue-500/20"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-white">{participant.countryName}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${participant.role === 'DEFENDER' ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                        {participant.role === 'DEFENDER' ? 'LEAD' : `ALLY OF ${participant.allyOf?.toUpperCase() ?? ''}`}
                      </span>
                    </div>
                    {participant.description && <p className="mt-1.5 text-xs text-dark-400 leading-relaxed">{participant.description}</p>}
                    <p className="mt-2 text-xs text-primary-400">View profile →</p>
                  </Link>
                ))}
              </div>
            </div>

            {conflict.participants.filter(p => p.role === 'MEDIATOR').length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-green-400/70 mb-2">Mediators</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {conflict.participants.filter(p => p.role === 'MEDIATOR').map((participant) => (
                    <Link
                      key={participant.isoCode}
                      href={`/countries/${participant.isoCode}`}
                      className="rounded-xl border px-4 py-3 text-sm hover:border-primary-500/40 transition-colors bg-green-500/5 border-green-500/20"
                    >
                      <p className="font-medium text-white">{participant.countryName}</p>
                      {participant.description && <p className="mt-1.5 text-xs text-dark-400 leading-relaxed">{participant.description}</p>}
                      <p className="mt-2 text-xs text-primary-400">View profile →</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Intensity snapshot</h2>
          <div className="space-y-4">
            {stats.length ? stats.map((stat) => (
              <div key={`intensity-${stat.id}`}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="text-dark-300">{stat.countryName ?? "Aggregate"}</span>
                  <span className="text-white">${(stat.economicLossUsd / 1_000_000_000).toFixed(1)}B</span>
                </div>
                <div className="h-2 rounded-full bg-dark-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300" style={{ width: `${Math.min(100, Math.max(8, stat.casualties / 2000))}%` }} />
                </div>
              </div>
            )) : <p className="text-sm text-dark-400">No impact stats available yet.</p>}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="section-title">Recent events</h2>
          <div className="space-y-4">
            {events.length ? events.map((event) => (
              <div key={event.id} className="rounded-xl border border-dark-700 bg-dark-950/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-white">{event.title}</p>
                  <span className={`badge-${event.confidenceLevel.toLowerCase()}`}>{event.confidenceLevel}</span>
                </div>
                <p className="mt-2 text-sm text-dark-300">{event.description}</p>
                <p className="mt-3 text-xs text-dark-500">{event.eventDate} · {event.source}</p>
              </div>
            )) : <p className="text-sm text-dark-400">No event entries available for this conflict yet.</p>}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Country impact snapshot</h2>
          <div className="space-y-4">
            {stats.length ? stats.map((stat) => (
              <div key={stat.id} className="rounded-xl border border-dark-700 bg-dark-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{stat.countryName ?? "Aggregate"}</p>
                  <span className={`badge-${stat.confidenceLevel.toLowerCase()}`}>{stat.confidenceLevel}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-dark-300">
                  <div>
                    <p className="text-dark-500">Casualties</p>
                    <p className="mt-1 text-white">{stat.casualties.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-dark-500">Economic loss</p>
                    <p className="mt-1 text-white">${(stat.economicLossUsd / 1_000_000_000).toFixed(1)}B</p>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-dark-400">No impact stats available yet.</p>}
          </div>
        </div>
      </section>

      {linkedEvents && linkedEvents.length > 0 && (
        <section className="card">
          <h2 className="section-title">Historical context</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {linkedEvents.map((he) => (
              <Link
                key={he.id}
                href={`/events/${he.id}`}
                className="block rounded-xl border border-dark-700 bg-dark-950/70 p-4 hover:border-primary-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary-400 tabular-nums">
                    {he.year}{he.endYear ? `–${he.endYear}` : ""}
                  </span>
                  <CategoryBadge category={he.category} />
                </div>
                <p className="mt-2 font-medium text-white">{he.title}</p>
                <p className="mt-1 text-sm text-dark-300 line-clamp-2">{he.overview}</p>
                <p className="mt-2 text-xs text-primary-400">Explore event →</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
