"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, X, TrendingUp, TrendingDown, Minus, ArrowUpDown } from "lucide-react";
import type { Conflict } from "@/lib/types";

type SortKey = "severity" | "casualties" | "date" | "name";
const SEVERITY_ORDER: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ConflictList({
  conflicts,
}: {
  conflicts: Conflict[];
}) {
  const [search, setSearch] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [severities, setSeverities] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("severity");

  const regionOptions = useMemo(
    () => Array.from(new Set(conflicts.map((c) => c.region))).sort(),
    [conflicts],
  );
  const severityOptions = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  const statusOptions = ["ACTIVE", "FROZEN", "RESOLVED"];

  const activeCount = regions.length + severities.length + statuses.length;

  const filtered = useMemo(() => {
    let list = conflicts;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.participants.some((p) =>
            p.countryName.toLowerCase().includes(q),
          ),
      );
    }
    if (regions.length)
      list = list.filter((c) => regions.includes(c.region));
    if (severities.length)
      list = list.filter((c) => severities.includes(c.severity));
    if (statuses.length)
      list = list.filter((c) => statuses.includes(c.status));

    // Sort
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "severity":
          return (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4);
        case "casualties":
          return b.totalCasualties - a.totalCasualties;
        case "date":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return list;
  }, [conflicts, search, regions, severities, statuses, sortBy]);

  const resetAll = () => {
    setRegions([]);
    setSeverities([]);
    setStatuses([]);
    setSearch("");
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
              placeholder="Search conflicts, regions, countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] pl-10 pr-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-primary-500/20 px-2 py-0.5 text-xs font-medium text-primary-400">
                {activeCount}
              </span>
            )}
            {filtersExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {activeCount > 0 && (
            <button
              onClick={resetAll}
              className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-red-400"
            >
              <X className="h-3 w-3" /> Reset
            </button>
          )}
        </div>

        {filtersExpanded && (
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
                    active={regions.includes(r)}
                    onClick={() => setRegions(toggleItem(regions, r))}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Severity
              </p>
              <div className="flex flex-wrap gap-2">
                {severityOptions.map((s) => (
                  <TogglePill
                    key={s}
                    label={s}
                    active={severities.includes(s)}
                    onClick={() => setSeverities(toggleItem(severities, s))}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((s) => (
                  <TogglePill
                    key={s}
                    label={s}
                    active={statuses.includes(s)}
                    onClick={() => setStatuses(toggleItem(statuses, s))}
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
          <p className="text-xs text-[var(--muted)]">Conflict{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {filtered.reduce((s, c) => s + c.totalCasualties, 0).toLocaleString()}
          </p>
          <p className="text-xs text-[var(--muted)]">Total casualties</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            ${(filtered.reduce((s, c) => s + c.economicLossUsd, 0) / 1_000_000_000).toFixed(1)}B
          </p>
          <p className="text-xs text-[var(--muted)]">Total losses</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {new Set(filtered.flatMap((c) => c.participants.map((p) => p.isoCode))).size}
          </p>
          <p className="text-xs text-[var(--muted)]">Nations involved</p>
        </div>
      </div>

      {/* Sort + results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {filtered.length} conflict{filtered.length !== 1 ? "s" : ""}
          {activeCount > 0 || search ? " matching filters" : ""}
        </p>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-[var(--muted)]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-primary-500"
          >
            <option value="severity">Severity</option>
            <option value="casualties">Casualties</option>
            <option value="date">Most recent</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Conflict cards */}
      {filtered.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((conflict) => (
            <Link
              key={conflict.id}
              href={`/conflicts/${conflict.id}`}
              className="card-hover block"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                    {conflict.region}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                    {conflict.name}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Since {formatDate(conflict.startDate)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`badge-${conflict.severity.toLowerCase()}`}
                  >
                    {conflict.severity}
                  </span>
                  <span
                    className={`badge-${conflict.status.toLowerCase()}`}
                  >
                    {conflict.status}
                  </span>
                  {conflict.escalationTrend && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        conflict.escalationTrend === "ESCALATING"
                          ? "bg-red-500/20 text-red-400"
                          : conflict.escalationTrend === "DE_ESCALATING"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {conflict.escalationTrend === "ESCALATING" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : conflict.escalationTrend === "DE_ESCALATING" ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                      {conflict.escalationTrend === "ESCALATING"
                        ? "Escalating"
                        : conflict.escalationTrend === "DE_ESCALATING"
                          ? "De-escalating"
                          : "Stable"}
                      {conflict.trendDelta !== undefined && (
                        <span className="ml-0.5">
                          {conflict.trendDelta > 0 ? "+" : ""}
                          {conflict.trendDelta}%
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                {conflict.description}
              </p>

              {/* Participant chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {conflict.participants.map((p) => (
                  <span
                    key={`${conflict.id}-${p.isoCode}`}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                      p.side === "AGGRESSOR" ||
                      (!p.side && p.role === "AGGRESSOR")
                        ? "border-red-500/30 text-red-400/80"
                        : p.side === "DEFENDER" ||
                            (!p.side && p.role === "DEFENDER")
                          ? "border-blue-500/30 text-blue-400/80"
                          : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {p.countryName}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-[var(--panel-muted)] p-3">
                  <p className="text-[var(--muted)] text-xs">Participants</p>
                  <p className="mt-1 font-medium text-[var(--foreground)]">
                    {conflict.participants.length}
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--panel-muted)] p-3">
                  <p className="text-[var(--muted)] text-xs">Casualties</p>
                  <p className="mt-1 font-medium text-[var(--foreground)]">
                    {conflict.totalCasualties.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--panel-muted)] p-3">
                  <p className="text-[var(--muted)] text-xs">Losses</p>
                  <p className="mt-1 font-medium text-[var(--foreground)]">
                    ${(conflict.economicLossUsd / 1_000_000_000).toFixed(1)}B
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-10 w-10 text-[var(--muted)] mb-4 opacity-40" />
          <p className="text-[var(--foreground)] font-medium">
            No conflicts match your filters
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={resetAll}
            className="mt-4 btn-secondary text-sm"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
