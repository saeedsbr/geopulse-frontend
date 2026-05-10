import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HomepageFilters, WatchlistItem, WarRoom, Conflict } from "@/lib/types";

const DEFAULT_FILTERS: HomepageFilters = {
  regions: [],
  severities: [],
  countries: [],
  conflictStatuses: [],
};

interface GeoPulseState {
  /* ── filter slice ── */
  filters: HomepageFilters;
  setRegions: (regions: string[]) => void;
  setSeverities: (s: HomepageFilters["severities"]) => void;
  setCountries: (c: string[]) => void;
  setConflictStatuses: (s: HomepageFilters["conflictStatuses"]) => void;
  resetFilters: () => void;

  /* ── watchlist slice (persisted) ── */
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, "pinnedAt">) => void;
  removeFromWatchlist: (type: string, id: string) => void;
  isWatched: (type: string, id: string) => boolean;

  /* ── polling slice ── */
  warRoomData: WarRoom | null;
  setWarRoomData: (data: WarRoom) => void;
  lastPolledAt: string | null;
  setLastPolledAt: (iso: string) => void;
  hasNewUpdates: boolean;
  setHasNewUpdates: (val: boolean) => void;
  pendingData: WarRoom | null;
  setPendingData: (data: WarRoom | null) => void;
  connectionState: "connected" | "polling" | "disconnected";
  setConnectionState: (s: "connected" | "polling" | "disconnected") => void;
}

export const useGeoPulseStore = create<GeoPulseState>()(
  persist(
    (set, get) => ({
      /* ── filters ── */
      filters: { ...DEFAULT_FILTERS },
      setRegions: (regions) =>
        set((s) => ({ filters: { ...s.filters, regions } })),
      setSeverities: (severities) =>
        set((s) => ({ filters: { ...s.filters, severities } })),
      setCountries: (countries) =>
        set((s) => ({ filters: { ...s.filters, countries } })),
      setConflictStatuses: (conflictStatuses) =>
        set((s) => ({ filters: { ...s.filters, conflictStatuses } })),
      resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

      /* ── watchlist ── */
      watchlist: [],
      addToWatchlist: (item) =>
        set((s) => ({
          watchlist: s.watchlist.some(
            (w) => w.type === item.type && w.id === item.id,
          )
            ? s.watchlist
            : [...s.watchlist, { ...item, pinnedAt: new Date().toISOString() }],
        })),
      removeFromWatchlist: (type, id) =>
        set((s) => ({
          watchlist: s.watchlist.filter(
            (w) => !(w.type === type && w.id === id),
          ),
        })),
      isWatched: (type, id) =>
        get().watchlist.some((w) => w.type === type && w.id === id),

      /* ── polling ── */
      warRoomData: null,
      setWarRoomData: (data) =>
        set({ warRoomData: data, lastPolledAt: new Date().toISOString() }),
      lastPolledAt: null,
      setLastPolledAt: (iso) => set({ lastPolledAt: iso }),
      hasNewUpdates: false,
      setHasNewUpdates: (val) => set({ hasNewUpdates: val }),
      pendingData: null,
      setPendingData: (data) => set({ pendingData: data }),
      connectionState: "polling",
      setConnectionState: (s) => set({ connectionState: s }),
    }),
    {
      name: "geopulse-store",
      partialize: (state) => ({ watchlist: state.watchlist }),
    },
  ),
);

/* ── filter helper ── */

export function applyFilters(data: WarRoom, filters: HomepageFilters): WarRoom {
  let conflicts = data.activeConflicts;
  let events = data.recentEvents;
  let news = data.breakingNews;
  let alerts = data.alerts;

  if (filters.regions.length) {
    conflicts = conflicts.filter((c) => filters.regions.includes(c.region));
  }

  if (filters.severities.length) {
    conflicts = conflicts.filter((c) =>
      filters.severities.includes(c.severity),
    );
    alerts = alerts.filter((a) =>
      filters.severities.includes(a.severity as Conflict["severity"]),
    );
  }

  if (filters.countries.length) {
    conflicts = conflicts.filter((c) =>
      c.participants.some((p) => filters.countries.includes(p.isoCode)),
    );
    news = news.filter((n) =>
      n.relatedCountries.some((iso) => filters.countries.includes(iso)),
    );
  }

  if (filters.conflictStatuses.length) {
    conflicts = conflicts.filter((c) =>
      filters.conflictStatuses.includes(c.status),
    );
  }

  // keep only events from remaining conflicts
  const conflictIds = new Set(conflicts.map((c) => c.id));
  events = events.filter((e) => conflictIds.has(e.conflictId));

  const globalStats = {
    ...data.globalStats,
    totalActiveConflicts: conflicts.filter((c) => c.status === "ACTIVE").length,
    totalCasualties: conflicts.reduce((sum, c) => sum + c.totalCasualties, 0),
    criticalAlerts: alerts.filter((a) => a.severity === "CRITICAL").length,
  };

  return {
    ...data,
    activeConflicts: conflicts,
    recentEvents: events,
    breakingNews: news,
    alerts,
    globalStats,
  };
}

export function activeFilterCount(filters: HomepageFilters): number {
  return (
    filters.regions.length +
    filters.severities.length +
    filters.countries.length +
    filters.conflictStatuses.length
  );
}
