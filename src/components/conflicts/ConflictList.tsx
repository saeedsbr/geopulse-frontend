import Link from "next/link";
import type { Conflict } from "@/lib/types";

export default function ConflictList({ conflicts }: { conflicts: Conflict[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {conflicts.map((conflict) => (
        <Link key={conflict.id} href={`/conflicts/${conflict.id}`} className="card-hover block">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-dark-500">{conflict.region}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{conflict.name}</h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`badge-${conflict.severity.toLowerCase()}`}>{conflict.severity}</span>
              <span className={`badge-${conflict.status.toLowerCase()}`}>{conflict.status}</span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-dark-300">{conflict.description}</p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-dark-950/60 p-3">
              <p className="text-dark-500">Participants</p>
              <p className="mt-1 font-medium text-white">{conflict.participants.length}</p>
            </div>
            <div className="rounded-lg bg-dark-950/60 p-3">
              <p className="text-dark-500">Casualties</p>
              <p className="mt-1 font-medium text-white">{conflict.totalCasualties.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-dark-950/60 p-3">
              <p className="text-dark-500">Losses</p>
              <p className="mt-1 font-medium text-white">${(conflict.economicLossUsd / 1_000_000_000).toFixed(1)}B</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
