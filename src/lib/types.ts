export interface Conflict {
  id: number;
  name: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'FROZEN' | 'RESOLVED';
  description: string;
  region: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  participants: ConflictParticipant[];
  totalCasualties: number;
  territoryChangeSqKm: number;
  economicLossUsd: number;
  linkedEventIds?: string[];
}

export interface ConflictParticipant {
  countryId: number;
  countryName: string;
  isoCode: string;
  role: 'AGGRESSOR' | 'DEFENDER' | 'MEDIATOR' | 'ALLY';
}

export interface ConflictEvent {
  id: number;
  conflictId: number;
  eventType: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  eventDate: string;
  source: string;
  confidenceLevel: string;
}

export interface ConflictStat {
  id: number;
  conflictId: number;
  countryId?: number;
  countryName?: string;
  casualties: number;
  territoryChangeSqKm: number;
  economicLossUsd: number;
  confidenceLevel: string;
  recordedAt: string;
}

export interface Country {
  id: number;
  name: string;
  isoCode: string;
  region: string;
  flagUrl: string;
}

export interface CountryProfile {
  countryId: number;
  countryName: string;
  isoCode: string;
  politicalSystem: string;
  currentLeadership: string;
  summary: string;
  warHistory: string;
  conflictRecord: string;
  strategicPrograms: string;
  intelligenceAssessment: string;
  population: number;
  gdpUsd: number;
  militaryStrength: string;
  lastUpdated: string;
}

export interface CountryRelation {
  id: number;
  countryId: number;
  countryName: string;
  relatedCountryId: number;
  relatedCountryName: string;
  relationType: 'ALLY' | 'RIVAL' | 'NEUTRAL' | 'TRADE_PARTNER' | 'SANCTIONED';
  description: string;
  strength: number;
}

export interface CountryDashboard {
  country: Country;
  profile: CountryProfile;
  activeConflicts: Conflict[];
  historicalConflicts: Conflict[];
  recentNews: NewsArticle[];
  strategicWatch: NewsArticle[];
  videos: AnalysisVideo[];
  relations: CountryRelation[];
  economy: EconomicSummary;
  historicalMilestones: HistoricalMilestone[];
}

export interface EconomicSummary {
  gdpUsd: number;
  totalEconomicLoss: number;
  activeConflicts: number;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  publishedAt: string;
  confidenceLevel: 'VERIFIED' | 'DISPUTED' | 'UNCONFIRMED';
  category: string;
  relatedCountries: string[];
  conflictId?: number;
}

export interface AnalysisVideo {
  id: number;
  title: string;
  description: string;
  youtubeVideoId: string;
  channelName: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  relatedCountries: string[];
  conflictId?: number;
}

export interface AnalysisResource {
  id: string | number;
  type: 'VIDEO' | 'ARTICLE';
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  fetchedAt?: string;
  region: string;
  topics: string[];
  analyst?: string;
  platform?: string;
  sourceCountryIso?: string;
  sourceCountryName?: string;
}

export interface HistoricalMilestone {
  id: number;
  year: number;
  title: string;
  description: string;
  category: 'NUCLEAR' | 'WAR' | 'INDEPENDENCE' | 'DIPLOMACY' | 'COUP' | 'TERRITORIAL' | 'ECONOMIC' | 'REVOLUTION';
  references: {
    title: string;
    source: string;
    url: string;
  }[];
  eventId?: string;
}

export interface HistoricalEventParticipant {
  countryId: number;
  countryName: string;
  isoCode: string;
  role: 'PRIMARY' | 'SECONDARY' | 'OPPONENT' | 'ALLY' | 'MEDIATOR' | 'AFFECTED';
  description: string;
}

export interface HistoricalEventTimelineEntry {
  date: string;
  title: string;
  description: string;
}

export interface HistoricalEvent {
  id: string;
  title: string;
  year: number;
  endYear?: number;
  category: 'NUCLEAR' | 'WAR' | 'INDEPENDENCE' | 'DIPLOMACY' | 'COUP' | 'TERRITORIAL' | 'ECONOMIC' | 'REVOLUTION';
  region: string;
  overview: string;
  causes: string;
  outcome: string;
  participants: HistoricalEventParticipant[];
  timeline: HistoricalEventTimelineEntry[];
  linkedConflictIds: number[];
  linkedEventIds: string[];
  references: {
    title: string;
    source: string;
    url: string;
  }[];
  significance: 'DEFINING' | 'MAJOR' | 'NOTABLE';
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  alertType: 'BREAKING' | 'UPDATE' | 'ANALYSIS';
  severity: string;
  conflictId?: number;
  conflictName?: string;
  countryId?: number;
  countryName?: string;
  createdAt: string;
  read: boolean;
}

export interface WarRoom {
  activeConflicts: Conflict[];
  recentEvents: ConflictEvent[];
  breakingNews: NewsArticle[];
  alerts: Alert[];
  globalStats: GlobalStats;
}

export interface GlobalStats {
  totalActiveConflicts: number;
  totalCountriesAffected: number;
  totalCasualties: number;
  criticalAlerts: number;
}
