"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Globe2, Landmark, Newspaper, ShieldAlert, LibraryBig } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "War Room", icon: ShieldAlert },
  { href: "/conflicts", label: "Conflicts", icon: Activity },
  { href: "/events", label: "Historical Events", icon: Landmark },
  { href: "/countries", label: "Country Intel", icon: Globe2 },
  { href: "/news", label: "News Feed", icon: Newspaper },
  { href: "/analysis", label: "Analysis", icon: LibraryBig },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-72 flex-col border-r px-5 py-6 bg-[var(--background)] border-[var(--border)] transition-colors">
      <Link href="/" className="mb-8 block">
        <p className="text-xs uppercase tracking-[0.25em] text-primary-400">GeoPulse</p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">Intelligence Platform</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Near real-time conflict tracking, country analysis, and geopolitical context.</p>
      </Link>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                active
                  ? "border-primary-500/40 bg-primary-500/10 text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted-strong)] hover:text-[var(--foreground)] bg-[var(--panel)] hover:border-[var(--border)]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-primary-500/20 bg-primary-500/5 p-4 text-sm text-[var(--muted-strong)]">
        <p className="font-medium text-[var(--foreground)]">Reliability layer</p>
        <p className="mt-2">Confidence labels, cross-source validation, and explicit uncertainty still need backend implementation.</p>
      </div>
    </aside>
  );
}
