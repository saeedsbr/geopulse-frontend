"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SearchResultItem {
    id: string;
    type: string;
    title: string;
    description: string;
    url: string;
}

interface SearchResponse {
    countries: SearchResultItem[];
    conflicts: SearchResultItem[];
    news: SearchResultItem[];
    totalResults: number;
}

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length === 0) {
                setResults(null);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setIsOpen(true);
                }
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const renderSection = (title: string, items: SearchResultItem[]) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-2">{title}</h4>
                <ul className="space-y-2">
                    {items.map((item, idx) => (
                        <li key={`${item.type}-${item.id}-${idx}`}>
                            <Link href={item.url} className="block group p-2 hover:bg-[var(--panel-active)] rounded transition-colors" onClick={() => setIsOpen(false)}>
                                <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-primary-400">{item.title}</p>
                                <p className="text-xs text-[var(--muted)] line-clamp-1">{item.description}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                placeholder="Search intelligence..."
                className="w-48 xl:w-64 bg-[var(--panel)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-full px-4 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-[var(--muted-strong)]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (results && results.totalResults > 0) setIsOpen(true); }}
            />

            {isOpen && results && results.totalResults > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto bg-[var(--panel-muted)] border border-[var(--border)] shadow-xl rounded-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    {renderSection("Countries", results.countries)}
                    {renderSection("Conflicts", results.conflicts)}
                    {renderSection("News & Alerts", results.news)}

                    {loading && <p className="text-xs text-center text-primary-400">Loading...</p>}
                </div>
            )}
        </div>
    );
}
