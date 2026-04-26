"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border border-[var(--border)] bg-[var(--panel-muted)] px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      aria-label="Toggle theme"
    >
      <span className="flex items-center gap-2">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {theme === "dark" ? "Light" : "Dark"} mode
      </span>
    </button>
  );
}
