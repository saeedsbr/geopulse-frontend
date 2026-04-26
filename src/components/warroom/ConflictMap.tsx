import type { ConflictEvent } from "@/lib/types";

const LAT_MIN = -60;
const LAT_MAX = 85;
const LNG_MIN = -180;
const LNG_MAX = 180;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPosition(latitude: number, longitude: number) {
  const x = ((clamp(longitude, LNG_MIN, LNG_MAX) - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  const y = ((LAT_MAX - clamp(latitude, LAT_MIN, LAT_MAX)) / (LAT_MAX - LAT_MIN)) * 100;
  return { left: `${x}%`, top: `${y}%` };
}

function badgeClass(confidenceLevel: string) {
  const level = confidenceLevel.toLowerCase();
  if (level === "verified") return "bg-green-400 ring-green-300/40";
  if (level === "disputed" || level === "medium") return "bg-yellow-400 ring-yellow-300/40";
  return "bg-red-400 ring-red-300/40";
}

export default function ConflictMap({ events }: { events: ConflictEvent[] }) {
  if (!events.length) {
    return <p className="text-sm text-dark-400">No geospatial events available yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-dark-700 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.96)_45%)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-dark-700/80" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-dark-700/80" />
        <div className="relative h-[320px] w-full">
          {events.map((event) => {
            const position = getPosition(event.latitude, event.longitude);
            return (
              <div
                key={event.id}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={position}
              >
                <div className={`h-3.5 w-3.5 rounded-full ring-4 ${badgeClass(event.confidenceLevel)}`} />
                <div className="pointer-events-none absolute left-1/2 top-5 z-10 hidden w-52 -translate-x-1/2 rounded-xl border border-dark-700 bg-dark-950/95 p-3 text-xs text-dark-200 shadow-xl group-hover:block">
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="mt-1 text-dark-400">{event.eventType}</p>
                  <p className="mt-2 leading-5 text-dark-300">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {events.slice(0, 3).map((event) => (
          <div key={event.id} className="rounded-xl border border-dark-700 bg-dark-950/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-white">{event.title}</p>
              <span className={`badge-${event.confidenceLevel.toLowerCase()}`}>{event.confidenceLevel}</span>
            </div>
            <p className="mt-2 text-xs text-dark-400">
              {event.latitude.toFixed(2)}, {event.longitude.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
