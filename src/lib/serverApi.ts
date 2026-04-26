import type { Alert, AnalysisResource, Conflict, ConflictEvent, ConflictStat, Country, CountryDashboard, HistoricalEvent, NewsArticle, WarRoom } from "@/lib/types";

const analysisWatchlistFallback: Country[] = [
  { id: 1, name: "United States", isoCode: "USA", region: "North America", flagUrl: "🇺🇸" },
  { id: 3, name: "China", isoCode: "CHN", region: "East Asia", flagUrl: "🇨🇳" },
  { id: 9, name: "India", isoCode: "IND", region: "South Asia", flagUrl: "🇮🇳" },
  { id: 11, name: "Saudi Arabia", isoCode: "SAU", region: "Middle East", flagUrl: "🇸🇦" },
  { id: 8, name: "Pakistan", isoCode: "PAK", region: "South Asia", flagUrl: "🇵🇰" },
  { id: 7, name: "Iran", isoCode: "IRN", region: "Middle East", flagUrl: "🇮🇷" },
  { id: 5, name: "Israel", isoCode: "ISR", region: "Middle East", flagUrl: "🇮🇱" },
  { id: 2, name: "Russia", isoCode: "RUS", region: "Europe/Asia", flagUrl: "🇷🇺" },
  { id: 4, name: "Ukraine", isoCode: "UKR", region: "Europe", flagUrl: "🇺🇦" },
  { id: 25, name: "United Kingdom", isoCode: "GBR", region: "Europe", flagUrl: "🇬🇧" },
  { id: 26, name: "France", isoCode: "FRA", region: "Europe", flagUrl: "🇫🇷" },
  { id: 27, name: "Germany", isoCode: "DEU", region: "Europe", flagUrl: "🇩🇪" },
  { id: 10, name: "Turkey", isoCode: "TUR", region: "Middle East/Europe", flagUrl: "🇹🇷" },
  { id: 28, name: "Egypt", isoCode: "EGY", region: "North Africa", flagUrl: "🇪🇬" },
  { id: 29, name: "Japan", isoCode: "JPN", region: "East Asia", flagUrl: "🇯🇵" },
];
import {
  countries,
  conflicts,
  warRoomData,
  newsArticles,
  alerts,
  dashboards,
  historicalEvents,
  analysisResources,
  getConflictById,
  getConflictEvents as getMockConflictEvents,
  getConflictStats as getMockConflictStats,
  getEventById as getMockEventById,
  getEventsByCountry as getMockEventsByCountry,
  getEventsByConflict as getMockEventsByConflict,
} from "@/lib/mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${path} with status ${response.status}`);
  }

  return response.json();
}

async function fetchWithFallback<T>(path: string, fallback: () => T): Promise<T> {
  try {
    return await fetchJson<T>(path);
  } catch {
    console.warn(`[serverApi] Backend unavailable for ${path}, using mock data`);
    return fallback();
  }
}

export const serverApi = {
  getWarRoom: () => fetchWithFallback<WarRoom>("/warroom", () => warRoomData),

  getConflicts: () => fetchWithFallback<Conflict[]>("/conflicts", () => conflicts),

  getConflict: (id: string) =>
    fetchWithFallback<Conflict>(`/conflicts/${id}`, () => {
      const conflict = getConflictById(id);
      if (!conflict) throw new Error(`Conflict ${id} not found in mock data`);
      return conflict;
    }),

  getConflictEvents: (id: string) =>
    fetchWithFallback<ConflictEvent[]>(`/conflicts/${id}/events`, () => getMockConflictEvents(id)),

  getConflictStats: (id: string) =>
    fetchWithFallback<ConflictStat[]>(`/conflicts/${id}/stats`, () => getMockConflictStats(id)),

  getCountries: () => fetchWithFallback<Country[]>("/countries", () => countries),

  getCountryDashboard: (isoCode: string) =>
    fetchWithFallback<CountryDashboard>(`/countries/iso/${isoCode}/dashboard`, () => {
      const dashboard = dashboards[isoCode.toUpperCase()];
      if (!dashboard) throw new Error(`Country ${isoCode} not found in mock data`);
      return dashboard;
    }),

  getNews: async () => {
    return fetchWithFallback<NewsArticle[]>("/news?page=0&size=20", () => newsArticles);
  },

  getAnalysis: async (countryIso?: string) => {
    const query = countryIso ? `?countryIso=${countryIso}` : "";
    return fetchWithFallback<AnalysisResource[]>(`/analysis${query}`, () =>
      countryIso ? analysisResources.filter((item) => item.sourceCountryIso === countryIso) : analysisResources
    );
  },

  getAnalysisWatchlist: async () =>
    fetchWithFallback<Country[]>("/countries/analysis-watchlist", () => analysisWatchlistFallback),

  getAlerts: async () => {
    return fetchWithFallback<Alert[]>("/alerts?page=0&size=20", () => alerts);
  },

  getEvents: () =>
    fetchWithFallback<HistoricalEvent[]>("/events", () => historicalEvents),

  getEvent: (id: string) =>
    fetchWithFallback<HistoricalEvent>(`/events/${id}`, () => {
      const event = getMockEventById(id);
      if (!event) throw new Error(`Event ${id} not found in mock data`);
      return event;
    }),

  getEventsByCountry: (isoCode: string) =>
    fetchWithFallback<HistoricalEvent[]>(`/events/country/${isoCode}`, () => getMockEventsByCountry(isoCode)),

  getEventsByConflict: (conflictId: number) =>
    fetchWithFallback<HistoricalEvent[]>(`/events/conflict/${conflictId}`, () => getMockEventsByConflict(conflictId)),
};
