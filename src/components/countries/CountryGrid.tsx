import Link from "next/link";
import type { CountryDashboard } from "@/lib/types";

export default function CountryGrid({ dashboards }: { dashboards: CountryDashboard[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {dashboards.map((dashboard) => (
        <Link key={dashboard.country.isoCode} href={`/countries/${dashboard.country.isoCode}`} className="card-hover block">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-3xl">{dashboard.country.flagUrl || "🌍"}</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{dashboard.country.name}</h2>
              <p className="mt-1 text-sm text-dark-400">{dashboard.country.region}</p>
            </div>
            <span className={`badge-${dashboard.economy.trend.toLowerCase() === "declining" ? "high" : dashboard.economy.trend.toLowerCase() === "improving" ? "low" : "medium"}`}>
              {dashboard.economy.trend}
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-dark-300">{dashboard.profile?.summary ?? "No profile summary available yet."}</p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-dark-950/60 p-3">
              <p className="text-dark-500">GDP</p>
              <p className="mt-1 font-medium text-white">${(dashboard.economy.gdpUsd / 1_000_000_000).toFixed(0)}B</p>
            </div>
            <div className="rounded-lg bg-dark-950/60 p-3">
              <p className="text-dark-500">Active conflicts</p>
              <p className="mt-1 font-medium text-white">{dashboard.economy.activeConflicts}</p>
            </div>
            <div className="rounded-lg bg-dark-950/60 p-3">
              <p className="text-dark-500">Relations</p>
              <p className="mt-1 font-medium text-white">{dashboard.relations.length}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
