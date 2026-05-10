"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useGeoPulseStore, activeFilterCount } from "@/lib/store";
import type { WarRoom } from "@/lib/types";

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

export default function HomepageFilters({ data }: { data: WarRoom }) {
  const [expanded, setExpanded] = useState(false);
  const {
    filters,
    setRegions,
    setSeverities,
    setCountries,
    setConflictStatuses,
    resetFilters,
  } = useGeoPulseStore();

  const count = activeFilterCount(filters);

  const regions = Array.from(
    new Set(data.activeConflicts.map((c) => c.region)),
  ).sort();

  const countrySet = new Map<string, string>();
  data.activeConflicts.forEach((c) =>
    c.participants.forEach((p) => countrySet.set(p.isoCode, p.countryName)),
  );
  const countryOptions = Array.from(countrySet.entries()).sort((a, b) =>
    a[1].localeCompare(b[1]),
  );

  const severityOptions: ("CRITICAL" | "HIGH" | "MEDIUM" | "LOW")[] = [
    "CRITICAL",
    "HIGH",
    "MEDIUM",
    "LOW",
  ];
  const statusOptions: ("ACTIVE" | "FROZEN" | "RESOLVED")[] = [
    "ACTIVE",
    "FROZEN",
    "RESOLVED",
  ];

  function toggleItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            Filters
          </span>
          {count > 0 && (
            <span className="rounded-full bg-primary-500/20 px-2 py-0.5 text-xs font-medium text-primary-400">
              {count} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetFilters();
              }}
              className="flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)] hover:text-red-400 hover:border-red-500/30"
            >
              <X className="h-3 w-3" />
              Reset
            </button>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[var(--muted)]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[var(--border)] px-5 py-4 space-y-4">
          {/* Region */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
              Region
            </p>
            <div className="flex flex-wrap gap-2">
              {regions.map((r) => (
                <TogglePill
                  key={r}
                  label={r}
                  active={filters.regions.includes(r)}
                  onClick={() =>
                    setRegions(toggleItem(filters.regions, r))
                  }
                />
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
              Severity
            </p>
            <div className="flex flex-wrap gap-2">
              {severityOptions.map((s) => (
                <TogglePill
                  key={s}
                  label={s}
                  active={filters.severities.includes(s)}
                  onClick={() =>
                    setSeverities(toggleItem(filters.severities, s))
                  }
                />
              ))}
            </div>
          </div>

          {/* Country */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
              Country
            </p>
            <div className="flex flex-wrap gap-2">
              {countryOptions.map(([iso, name]) => (
                <TogglePill
                  key={iso}
                  label={name}
                  active={filters.countries.includes(iso)}
                  onClick={() =>
                    setCountries(toggleItem(filters.countries, iso))
                  }
                />
              ))}
            </div>
          </div>

          {/* Conflict Status */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
              Conflict Status
            </p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((s) => (
                <TogglePill
                  key={s}
                  label={s}
                  active={filters.conflictStatuses.includes(s)}
                  onClick={() =>
                    setConflictStatuses(
                      toggleItem(filters.conflictStatuses, s),
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
