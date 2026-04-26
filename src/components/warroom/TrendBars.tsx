type TrendDatum = {
  label: string;
  value: number;
  tone?: "critical" | "high" | "medium" | "low";
  suffix?: string;
};

const toneClass: Record<NonNullable<TrendDatum["tone"]>, string> = {
  critical: "from-red-500 to-red-300",
  high: "from-orange-500 to-orange-300",
  medium: "from-yellow-500 to-yellow-300",
  low: "from-green-500 to-green-300",
};

export default function TrendBars({ data }: { data: TrendDatum[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const width = `${Math.max((item.value / max) * 100, 6)}%`;
        const gradient = toneClass[item.tone ?? "medium"];

        return (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="text-dark-300">{item.label}</span>
              <span className="font-medium text-white">
                {item.value.toLocaleString()}
                {item.suffix ?? ""}
              </span>
            </div>
            <div className="h-3 rounded-full bg-dark-800">
              <div className={`h-3 rounded-full bg-gradient-to-r ${gradient}`} style={{ width }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
