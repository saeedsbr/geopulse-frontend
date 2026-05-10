export default function HomeLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-primary-500/20 bg-dark-900 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="h-4 w-40 rounded bg-dark-700" />
            <div className="h-10 w-56 rounded bg-dark-700" />
            <div className="h-5 w-96 rounded bg-dark-700" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-dark-700 bg-dark-950/70 p-6">
                <div className="h-3 w-24 rounded bg-dark-700 mb-3" />
                <div className="h-8 w-16 rounded bg-dark-700 mb-2" />
                <div className="h-3 w-32 rounded bg-dark-700" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-dark-700 bg-dark-950/50 p-5 h-72" />
          <div className="rounded-2xl border border-dark-700 bg-dark-950/50 p-5 h-72" />
        </div>
      </div>

      {/* Priority theaters + sidebar skeleton */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-xl border border-dark-700 bg-dark-900 p-6 space-y-4">
          <div className="h-6 w-48 rounded bg-dark-700" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-dark-700 bg-dark-950/70 p-5 h-36" />
          ))}
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-dark-700 bg-dark-900 p-6 h-52" />
          <div className="rounded-xl border border-dark-700 bg-dark-900 p-6 h-40" />
          <div className="rounded-xl border border-dark-700 bg-dark-900 p-6 h-48" />
        </div>
      </div>

      {/* Map + scoreboard skeleton */}
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-xl border border-dark-700 bg-dark-900 p-6 h-[420px]" />
        <div className="rounded-xl border border-dark-700 bg-dark-900 p-6 h-[420px]" />
      </div>
    </div>
  );
}
