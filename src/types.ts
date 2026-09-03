export type SubscriptionPlan = 'basic' | 'pro';
export type ClubStatus = 'active' | 'pending' | 'suspended';
export type EventType = 'friendly' | 'tournament' | 'plateau';
export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'ATT';

export interface ClubLimits {
  maxEventsPerMonth: number;
  customTemplates: boolean;
  highResExport: boolean;
  prioritySupport: boolean;
  unlimitedPhotos: boolean;
  customSponsors: boolean;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  code: string;
  city: string;
  postalCode: string;
  foundedYear: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  bannerUrl?: string;
  contactEmail: string;
  contactPhone: string;
  presidentName: string;
  stadiumName: string;
  stadiumAddress: string;
  plan: SubscriptionPlan;
  status: ClubStatus;
  joinedDate: string;
  renewDate: string;
  eventsCount: number;
  postersCount: number;
  limits: ClubLimits;
  bio?: string;
}

export interface Team {
  id: string;
  clubId: string;
  name: string; // e.g. "Séniors A", "U17 R2", "Féminines R1"
  category: 'seniors' | 'u19' | 'u17' | 'u15' | 'u13' | 'u11' | 'u9' | 'u7' | 'veterans' | 'feminines';
  categoryLabel: string;
  coachName: string;
  coachPhone?: string;
  championship: string; // e.g. "Régional 3 - Poule B" ou "Départemental 1"
  season: string;
}

export interface Player {
  id: string;
  teamId: string;
  clubId: string;
  firstName: string;
  lastName: string;
  number: number;
  position: PlayerPosition;
  isCaptain?: boolean;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  photoUrl?: string;
}

export interface Scorer {
  playerName: string;
  minute: number;
  isOpponent?: boolean;
  isPenalty?: boolean;
}

export interface MatchSummary {
  scoreHome: number;
  scoreAway: number;
  scorers: Scorer[];
  mvpPlayerName?: string;
  mvpClub?: 'home' | 'away';
  shotsHome?: number;
  shotsAway?: number;
  cornersHome?: number;
  cornersAway?: number;
  foulsHome?: number;
  foulsAway?: number;
  possessionHome?: number;
  coachQuote?: string;
  highlights?: string[];
  summaryPosterUrl?: string;
}

export interface FootballEvent {
  id: string;
  clubId: string;
  teamId: string;
  type: EventType;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  stadium: string;
  city: string;
  address?: string;
  isHome: boolean; // Domicile / Extérieur
  
  // Amical spécifique
  opponentName?: string;
  opponentCity?: string;
  opponentLogo?: string;
  category: string; // Séniors, U17, etc.
  competitionName?: string; // "Match Amical de Préparation", "Coupe de France", etc.
  isFinished?: boolean;
  summary?: MatchSummary;
  
  // Tournoi spécifique
  tournamentEdition?: string;
  teamsCount?: number;
  tournamentFormat?: string; // "16 équipes - 4 poules + consolante"
  dotation?: string; // "Trophées, médailles, lots partenaires"
  cateringInfo?: string; // "Buvette & grillades toute la journée"
  
  // Plateau spécifique (jeunes U7-U13)
  ageCategory?: string; // "U9 / U11"
  pitchesCount?: number;
  participatingClubs?: string[];
  matchDurationMinutes?: number;

  // Poster configuration
  hasPoster: boolean;
  posterConfig?: PosterConfig;
  notes?: string;
}

export type PosterTemplate = 'matchday_dynamic' | 'choc_weekend' | 'retro_gazette' | 'neon_stadium' | 'minimal_pro';
export type PosterFormat = 'square' | 'story' | 'landscape'; // 1:1, 9:16, 16:9

export interface PosterConfig {
  template: PosterTemplate;
  format: PosterFormat;
  title: string; // "JOUR DE MATCH", "MATCH AMICAL", "GRAND TOURNOI", etc.
  subtitle?: string; // "Coup d'envoi 15h00 • Entrée libre"
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeColor: string;
  awayColor: string;
  dateStr: string;
  timeStr: string;
  stadium: string;
  city: string;
  competition: string;
  sponsorText?: string;
  entryFee?: string;
  
  // Pour le résumé
  isResult?: boolean;
  scoreHome?: number;
  scoreAway?: number;
  scorersText?: string;
  mvpText?: string;
}

export type RequestType = 
  | 'create_match' 
  | 'create_tournament' 
  | 'create_plateau' 
  | 'urgent_poster' 
  | 'update_roster' 
  | 'custom_request';

export type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';
export type RequestUrgency = 'normal' | 'urgent';

export interface ClubRequest {
  id: string;
  clubId: string;
  clubName: string;
  type: RequestType;
  typeLabel: string;
  title: string;
  description: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  operatorNotes?: string;
  details?: Record<string, any>;
  linkedEventId?: string;
  outputVisualUrl?: string;
}

export type ActiveRole = 'operator' | 'club';
