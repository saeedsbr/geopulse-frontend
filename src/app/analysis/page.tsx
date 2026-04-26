import AnalysisCountryFilter from "@/components/analysis/AnalysisCountryFilter";
import AnalysisFeed from "@/components/analysis/AnalysisFeed";
import { serverApi } from "@/lib/serverApi";

export const metadata = { title: "Analysis - GeoPulse" };
export const revalidate = 3600; // Re-fetch analysis every hour

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams?: { country?: string };
}) {
  const selectedCountry = searchParams?.country?.toUpperCase();
  const [resources, countries] = await Promise.all([
    serverApi.getAnalysis(selectedCountry),
    serverApi.getAnalysisWatchlist(),
  ]);

  const selectedCountryLabel = countries.find((country) => country.isoCode === selectedCountry)?.name;

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary-400">Analyst Desk</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Strategic Analysis</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Country-based analyst views from a 15-country watchlist. Open any item to read or watch the original source.
            </p>
          </div>
          <div className="rounded-xl border border-primary-500/20 bg-primary-500/10 px-4 py-3 text-sm text-primary-200">
            Updates every hour {selectedCountryLabel ? `• focused on ${selectedCountryLabel}` : "• across top watchlist countries"}
          </div>
        </div>
      </section>

      <AnalysisCountryFilter countries={countries} selectedIso={selectedCountry} />
      <AnalysisFeed resources={resources} />
    </div>
  );
}
