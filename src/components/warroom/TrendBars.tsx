"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type TrendDatum = {
  label: string;
  value: number;
  tone?: "critical" | "high" | "medium" | "low";
  suffix?: string;
  history?: number[];
  escalationTrend?: "ESCALATING" | "DE_ESCALATING" | "STABLE";
  trendDelta?: number;
};

const toneClass: Record<NonNullable<TrendDatum["tone"]>, string> = {
  critical: "from-red-500 to-red-300",
  high: "from-orange-500 to-orange-300",
  medium: "from-yellow-500 to-yellow-300",
  low: "from-green-500 to-green-300",
};

const toneStroke: Record<NonNullable<TrendDatum["tone"]>, string> = {
  critical: "#f87171",
  high: "#fb923c",
  medium: "#facc15",
  low: "#4ade80",
};

function EscalationBadge({
  trend,
}: {
  trend?: TrendDatum["escalationTrend"];
}) {
  if (!trend) return null;
  if (trend === "ESCALATING")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-400">
        <TrendingUp className="h-3 w-3" /> Escalating
      </span>
    );
  if (trend === "DE_ESCALATING")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400">
        <TrendingDown className="h-3 w-3" /> De-escalating
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
      <Minus className="h-3 w-3" /> Stable
    </span>
  );
}

export default function TrendBars({ data }: { data: TrendDatum[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-5">
      {data.map((item) => {
        const width = `${Math.max((item.value / max) * 100, 6)}%`;
        const gradient = toneClass[item.tone ?? "medium"];
        const stroke = toneStroke[item.tone ?? "medium"];
        const sparkData = item.history?.map((v) => ({ v }));

        return (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[var(--muted-strong)] truncate">
                  {item.label}
                </span>
                <EscalationBadge trend={item.escalationTrend} />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {sparkData && sparkData.length > 1 && (
                  <div className="w-20 h-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke={stroke}
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <span className="font-medium text-[var(--foreground)]">
                  {item.value.toLocaleString()}
                  {item.suffix ?? ""}
                </span>
                {item.trendDelta !== undefined && (
                  <span
                    className={`text-xs font-medium ${item.trendDelta > 0 ? "text-red-400" : item.trendDelta < 0 ? "text-green-400" : "text-[var(--muted)]"}`}
                  >
                    {item.trendDelta > 0 ? "▲" : item.trendDelta < 0 ? "▼" : "—"}{" "}
                    {Math.abs(item.trendDelta)}%
                  </span>
                )}
              </div>
            </div>
            <div className="h-3 rounded-full bg-dark-800">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${gradient}`}
                style={{ width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
