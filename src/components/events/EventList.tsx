import Link from "next/link";
import type { HistoricalEvent } from "@/lib/types";
import { CategoryBadge } from "@/components/shared/CategoryBadge";

const significanceStyle: Record<string, string> = {
  DEFINING: "badge-critical",
  MAJOR: "badge-high",
  NOTABLE: "badge-medium",
};

export default function EventList({ events }: { events: HistoricalEvent[] }) {
  const sorted = [...events].sort((a, b) => b.year - a.year);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {sorted.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className="card-hover block"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary-400 tabular-nums">
                {event.year}{event.endYear ? `–${event.endYear}` : ""}
              </span>
              <CategoryBadge category={event.category} />
            </div>
            <span className={significanceStyle[event.significance] ?? "badge-medium"}>
              {event.significance}
            </span>
          </div>

          <h2 className="mt-3 text-lg font-semibold text-[var(--foreground)]">{event.title}</h2>

          <p className="mt-1 text-xs text-[var(--muted)]">{event.region}</p>

          <p className="mt-3 text-sm text-[var(--muted-strong)] line-clamp-2">{event.overview}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {event.participants.map((p) => (
              <span
                key={p.isoCode}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--panel)] border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-strong)]"
              >
                {p.countryName}
                <span className="text-[var(--muted)]">· {p.role}</span>
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs font-medium text-primary-400">Explore event →</p>
        </Link>
      ))}
    </div>
  );
}
