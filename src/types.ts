export const SPORTS = ["Basketball", "Baseball", "Football", "Soccer", "Tennis", "Combat Sports"] as const;
export type Sport = (typeof SPORTS)[number];

export type Rarity = "Common" | "Bronze" | "Silver" | "Gold" | "Diamond" | "Mythic";

// Changed to string so you can add infinite athletes without breaking the app
export type CardId = string;

export type Quirk = "#SHOWTIME" | "#GREATNESS" | "#PickSix" | "#WalkoffKO";
export type Theme = "Base Live" | "2016 Historic Collection" | "Icons";
export type PackId = "starter" | "marquee" | "legends";
export type StaffRole = "intern" | "editor" | "producer";
export type Grade = "Perfect" | "Good" | "Flop" | "Auto";

export interface Card {
  id: CardId;
  name: string;
  sport: Sport;
  rarity: Rarity;
  ovr: number;
  baseViews: number;
  cpm: number;
  theme: Theme;
  quirks: readonly Quirk[];
  color: string;
  number: string;
  imageUrl: string; // The ESPN Photo URL
}

export interface OwnedCard { count: number; views: number; locked: boolean; }
export interface Staff { id: number; role: StaffRole; cardId: CardId | null; paused: boolean; }
export interface PackCard { cardId: CardId; revealed: boolean; duplicate: boolean; }
export interface PendingPack { id: number; kind: PackId; cards: PackCard[]; }
export interface GameSave { cash: number; totalViews: number; inventory: Partial<Record<CardId, OwnedCard>>; activeCard: CardId; staff: Staff[]; upgrades: { sponsor: number; }; rng: number; nextId: number; clockMs: number; pendingPack: PendingPack | null; }
export interface Yield { grade: Grade; views: number; gross: number; wage: number; net: number; }
export interface Trend { sport: Sport; multiplier: number; otherMultiplier: number; remainingMs: number; defensive: boolean; }
export interface Production { deskId: number; cardId: CardId; result: Yield; }
export interface GameEvent { id: number; deskId: number | null; at: number; text: string; views: number; cash: number; }
