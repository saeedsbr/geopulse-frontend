"use client";

import Link from "next/link";
import { Star, X } from "lucide-react";
import { useGeoPulseStore } from "@/lib/store";

export default function WatchlistPanel() {
  const { watchlist, removeFromWatchlist } = useGeoPulseStore();

  if (!watchlist.length) return null;

  const sorted = [...watchlist].sort(
    (a, b) => new Date(b.pinnedAt).getTime() - new Date(a.pinnedAt).getTime(),
  );

  return (
    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-semibold text-[var(--foreground)]">
          Your Watchlist
        </span>
        <span className="text-xs text-[var(--muted)]">
          ({watchlist.length} item{watchlist.length !== 1 ? "s" : ""})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sorted.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5"
          >
            <Link
              href={
                item.type === "conflict"
                  ? `/conflicts/${item.id}`
                  : `/countries/${item.id}`
              }
              className="text-xs font-medium text-yellow-300 hover:text-yellow-200 hover:underline"
            >
              {item.name}
            </Link>
            <button
              onClick={() => removeFromWatchlist(item.type, item.id)}
              className="text-yellow-400/60 hover:text-red-400 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
