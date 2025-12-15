export interface Review {
  id: string;
  fromName: string;
  fromAvatar: string;
  skill: number;
  manner: number;
  comment?: string;
  createdAt: string;
}

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  country: string; // ISO code e.g., 'AR', 'BR', 'PT'
  position: Position;
  skillScore: number; // 0-5
  mannerScore: number; // 0-5
  matchesPlayed: number;
  reviews: Review[];
}

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  REVIEWED = 'REVIEWED'
}

export interface Match {
  id: string;
  creatorId: string;
  location: string;
  date: string; // ISO string
  status: MatchStatus;
  players: User[];
  scores: { teamA: number; teamB: number };
}

export type TabView = 'HOME' | 'CREATE' | 'PROFILE' | 'LOGIN';