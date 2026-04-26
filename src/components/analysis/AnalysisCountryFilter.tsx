"use client";

import type { Country } from "@/lib/types";

interface Props {
  countries: Country[];
  selectedIso?: string;
}

export default function AnalysisCountryFilter({ countries, selectedIso }: Props) {
  return (
    <div className="card">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Country analyst views</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Choose a country to see analyst perspectives, articles, and linked briefings associated with that country.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/analysis"
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${!selectedIso ? "border-primary-500/40 bg-primary-500/10 text-[var(--foreground)]" : "border-[var(--border)] bg-[var(--panel-muted)] text-[var(--muted-strong)] hover:text-[var(--foreground)]"}`}
          >
            All countries
          </a>
          {countries.map((country) => {
            const active = selectedIso === country.isoCode;
            return (
              <a
                key={country.isoCode}
                href={`/analysis?country=${country.isoCode}`}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${active ? "border-primary-500/40 bg-primary-500/10 text-[var(--foreground)]" : "border-[var(--border)] bg-[var(--panel-muted)] text-[var(--muted-strong)] hover:text-[var(--foreground)]"}`}
              >
                <span className="mr-2">{country.flagUrl || "🌍"}</span>
                {country.name}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
