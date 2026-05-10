"use client";

import dynamic from "next/dynamic";
import type { ConflictEvent } from "@/lib/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-2xl bg-dark-900 animate-pulse border border-[var(--border)]" />
  ),
});

export default function ConflictMap({ events }: { events: ConflictEvent[] }) {
  if (!events.length) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-2xl border border-[var(--border)] bg-[var(--panel-muted)]">
        <p className="text-sm text-[var(--muted)]">
          No geospatial events available yet.
        </p>
      </div>
    );
  }

  return <LeafletMap events={events} />;
}
