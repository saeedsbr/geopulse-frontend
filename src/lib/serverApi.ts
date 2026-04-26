import type { Alert, AnalysisResource, Conflict, ConflictEvent, ConflictStat, Country, CountryDashboard, HistoricalEvent, NewsArticle, WarRoom } from "@/lib/types";
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

  getAnalysis: async () => analysisResources,

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
