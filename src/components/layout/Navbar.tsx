"use client";

import { Bell, User, Globe } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import GlobalSearch from "@/components/search/GlobalSearch";
import { useGeoPulseStore } from "@/lib/store";

export default function Navbar() {
  const connectionState = useGeoPulseStore((s) => s.connectionState);

  const dotColor =
    connectionState === "connected"
      ? "bg-green-500"
      : connectionState === "polling"
        ? "bg-yellow-500"
        : "bg-red-500";

  const label =
    connectionState === "connected"
      ? "Live"
      : connectionState === "polling"
        ? "Polling"
        : "Offline";

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between bg-[var(--panel)] border-[var(--border)] transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <GlobalSearch />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Globe className="w-3.5 h-3.5" />
          <span>{label}</span>
          <span
            className={`w-2 h-2 ${dotColor} rounded-full animate-pulse`}
          />
        </div>

        <button className="relative p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <ThemeToggle />

        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors bg-[var(--panel-muted)] text-[var(--muted-strong)] hover:text-[var(--foreground)]">
          <User className="w-4 h-4" />
          <span>Guest</span>
        </button>
      </div>
    </header>
  );
}
