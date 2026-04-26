import AnalysisFeed from "@/components/analysis/AnalysisFeed";
import { serverApi } from "@/lib/serverApi";

export const metadata = { title: "Analysis - GeoPulse" };

export default async function AnalysisPage() {
  const resources = await serverApi.getAnalysis();

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary-400">Analyst Desk</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Strategic Analysis</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Curated analysis links from top geopolitical analysts, research outlets, and video explainers. Open any item to read or watch the original source.
            </p>
          </div>
          <div className="rounded-xl border border-primary-500/20 bg-primary-500/10 px-4 py-3 text-sm text-primary-200">
            Focus: expert videos, think-tank articles, and strategic briefings
          </div>
        </div>
      </section>

      <AnalysisFeed resources={resources} />
    </div>
  );
}
