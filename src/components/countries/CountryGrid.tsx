"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import type { CountryDashboard } from "@/lib/types";
import { useGeoPulseStore } from "@/lib/store";

const SEVERITY_ORDER: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

function getThreatLevel(dashboard: CountryDashboard): string {
  if (!dashboard.activeConflicts.length) return "NONE";
  return dashboard.activeConflicts.reduce((best, c) => {
    return (SEVERITY_ORDER[c.severity] ?? 4) < (SEVERITY_ORDER[best] ?? 4) ? c.severity : best;
  }, "LOW" as string);
}

const threatBadge: Record<string, string> = {
  CRITICAL: "badge-critical",
  HIGH: "badge-high",
  MEDIUM: "badge-medium",
  LOW: "badge-low",
};

const trendBadge = (trend: string) => {
  if (trend === "DECLINING") return "badge-high";
  if (trend === "IMPROVING") return "badge-low";
  return "badge-medium";
};

function TogglePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-primary-500 bg-primary-500/20 text-primary-400"
          : "border-[var(--border)] text-[var(--muted)] hover:border-primary-500/40 hover:text-[var(--muted-strong)]"
      }`}
    >
      {label}
    </button>
  );
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export default function CountryGrid({
  dashboards,
}: {
  dashboards: CountryDashboard[];
}) {
  const [search, setSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { addToWatchlist, removeFromWatchlist, isWatched } = useGeoPulseStore();

  const regionOptions = useMemo(
    () => Array.from(new Set(dashboards.map((d) => d.country.region))).sort(),
    [dashboards],
  );

  const filtered = useMemo(() => {
    let list = dashboards;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.country.name.toLowerCase().includes(q) ||
          d.country.region.toLowerCase().includes(q) ||
          d.profile?.summary?.toLowerCase().includes(q),
      );
    }
    if (selectedRegions.length)
      list = list.filter((d) => selectedRegions.includes(d.country.region));
    if (selectedTrends.length)
      list = list.filter((d) => selectedTrends.includes(d.economy.trend));
    return list;
  }, [dashboards, search, selectedRegions, selectedTrends]);

  const activeFilterCount = selectedRegions.length + selectedTrends.length;

  const grouped = useMemo(() => {
    const map: Record<string, CountryDashboard[]> = {};
    for (const d of filtered) {
      if (!map[d.country.region]) map[d.country.region] = [];
      map[d.country.region].push(d);
    }
    return map;
  }, [filtered]);

  const totalConflicts = filtered.reduce((s, d) => s + d.economy.activeConflicts, 0);
  const totalGdp = filtered.reduce((s, d) => s + d.economy.gdpUsd, 0);
  const totalRelations = filtered.reduce((s, d) => s + d.relations.length, 0);

  const resetAll = () => {
    setSearch("");
    setSelectedRegions([]);
    setSelectedTrends([]);
  };

  return (
    <div className="space-y-6">
      {/* Search + filter bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search countries, regions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] pl-10 pr-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-primary-500/20 px-2 py-0.5 text-xs font-medium text-primary-400">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={resetAll}
              className="text-xs text-[var(--muted)] hover:text-red-400"
            >
              Reset
            </button>
          )}
        </div>

        {filtersOpen && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Region
              </p>
              <div className="flex flex-wrap gap-2">
                {regionOptions.map((r) => (
                  <TogglePill
                    key={r}
                    label={r}
                    active={selectedRegions.includes(r)}
                    onClick={() => setSelectedRegions(toggleItem(selectedRegions, r))}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Economic trend
              </p>
              <div className="flex flex-wrap gap-2">
                {["IMPROVING", "STABLE", "DECLINING"].map((t) => (
                  <TogglePill
                    key={t}
                    label={t}
                    active={selectedTrends.includes(t)}
                    onClick={() => setSelectedTrends(toggleItem(selectedTrends, t))}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">{filtered.length}</p>
          <p className="text-xs text-[var(--muted)]">Countries</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">{totalConflicts}</p>
          <p className="text-xs text-[var(--muted)]">Active conflicts</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            ${(totalGdp / 1_000_000_000_000).toFixed(1)}T
          </p>
          <p className="text-xs text-[var(--muted)]">Combined GDP</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">{totalRelations}</p>
          <p className="text-xs text-[var(--muted)]">Tracked relations</p>
        </div>
      </div>

      {/* Cards grouped by region */}
      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([region, items]) => (
          <div key={region}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3 border-b border-[var(--border)] pb-2">
              {region}
            </h2>
            <div className="grid gap-5 lg:grid-cols-2 mb-6">
              {items.map((dashboard) => {
                const threat = getThreatLevel(dashboard);
                const watched = isWatched("country", dashboard.country.isoCode);
                return (
                  <div key={dashboard.country.isoCode} className="relative">
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
                      className="absolute top-4 right-4 z-10 p-1.5 rounded-full transition-colors hover:bg-[var(--panel-muted)]"
                      title={watched ? "Unpin from watchlist" : "Pin to watchlist"}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          watched ? "fill-yellow-400 text-yellow-400" : "text-[var(--muted)]"
                        }`}
                      />
                    </button>
                    <Link
                      href={`/countries/${dashboard.country.isoCode}`}
                      className="card-hover block"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-3xl">{dashboard.country.flagUrl || "🌍"}</p>
                          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                            {dashboard.country.name}
                          </h2>
                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {dashboard.country.region}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 mr-8">
                          {threat !== "NONE" && (
                            <span className={threatBadge[threat]}>
                              {threat} THREAT
                            </span>
                          )}
                          <span className={trendBadge(dashboard.economy.trend)}>
                            {dashboard.economy.trend}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-[var(--muted-strong)]">
                        {dashboard.profile?.summary ?? "No profile summary available yet."}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-[var(--panel-muted)] p-3">
                          <p className="text-[var(--muted)] text-xs">GDP</p>
                          <p className="mt-1 font-medium text-[var(--foreground)]">
                            ${(dashboard.economy.gdpUsd / 1_000_000_000).toFixed(0)}B
                          </p>
                        </div>
                        <div className="rounded-lg bg-[var(--panel-muted)] p-3">
                          <p className="text-[var(--muted)] text-xs">Active conflicts</p>
                          <p className="mt-1 font-medium text-[var(--foreground)]">
                            {dashboard.economy.activeConflicts}
                          </p>
                        </div>
                        <div className="rounded-lg bg-[var(--panel-muted)] p-3">
                          <p className="text-[var(--muted)] text-xs">Relations</p>
                          <p className="mt-1 font-medium text-[var(--foreground)]">
                            {dashboard.relations.length}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-10 w-10 text-[var(--muted)] mb-4 opacity-40" />
          <p className="text-[var(--foreground)] font-medium">
            No countries match your filters
          </p>
          <button onClick={resetAll} className="mt-4 btn-secondary text-sm">
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
