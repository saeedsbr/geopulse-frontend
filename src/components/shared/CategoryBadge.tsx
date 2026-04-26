export const categoryConfig: Record<string, { label: string; color: string; icon: string }> = {
  NUCLEAR: { label: "Nuclear", color: "text-yellow-400 bg-yellow-500/15 border-yellow-500/20", icon: "☢️" },
  WAR: { label: "War", color: "text-red-400 bg-red-500/15 border-red-500/20", icon: "⚔️" },
  INDEPENDENCE: { label: "Independence", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20", icon: "🏛️" },
  DIPLOMACY: { label: "Diplomacy", color: "text-blue-400 bg-blue-500/15 border-blue-500/20", icon: "🤝" },
  COUP: { label: "Coup", color: "text-purple-400 bg-purple-500/15 border-purple-500/20", icon: "💥" },
  TERRITORIAL: { label: "Territorial", color: "text-orange-400 bg-orange-500/15 border-orange-500/20", icon: "🗺️" },
  ECONOMIC: { label: "Economic", color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/20", icon: "📈" },
  REVOLUTION: { label: "Revolution", color: "text-rose-400 bg-rose-500/15 border-rose-500/20", icon: "✊" },
};

export function CategoryBadge({ category }: { category: string }) {
  const cat = categoryConfig[category] ?? categoryConfig.WAR;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cat.color}`}>
      {cat.icon} {cat.label}
    </span>
  );
}
