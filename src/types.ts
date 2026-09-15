export const SPORTS = ["Basketball", "Baseball", "Football", "Hockey", "Soccer", "Tennis", "Combat Sports"] as const;
export type Sport = (typeof SPORTS)[number];

export type Rarity = "Common" | "Bronze" | "Silver" | "Gold" | "Diamond" | "Mythic" | "Hero";
export type CardId = string;

export type Quirk = "#SHOWTIME" | "#GREATNESS" | "#PickSix" | "#WalkoffKO";
export type Theme = "Live Series" | "Champion Heroes";
export type PackId = "nba-pack" | "nfl-pack" | "mlb-pack" | "nhl-pack" | "soccer-pack" | "combat-pack" | "tennis-pack" | "silver-plus" | "diamond-plus" | "hero-vault";
export type StaffRole = "intern" | "editor" | "producer";
export type Grade = "Perfect" | "Good" | "Flop" | "Auto";

export interface Card { id: CardId; name: string; sport: Sport; rarity: Rarity; ovr: number; baseViews: number; cpm: number; theme: Theme; quirks: readonly Quirk[]; color: string; number: string; imageUrl: string; }
export interface OwnedCard { count: number; views: number; locked: boolean; }
export interface Staff { id: number; role: StaffRole; cardId: CardId | null; paused: boolean; }
export interface PackCard { cardId: CardId; revealed: boolean; duplicate: boolean; }
export interface PendingPack { id: number; kind: PackId; cards: PackCard[]; }
export interface GameSave { cash: number; totalViews: number; agencyXp: number; agencyLevel: number; inventory: Partial<Record<CardId, OwnedCard>>; activeCard: CardId; staff: Staff[]; upgrades: { sponsor: number; floor: number; }; nextId: number; clockMs: number; pendingPack: PendingPack | null; }
export interface Yield { grade: Grade; views: number; gross: number; net: number; xp: number; }
export interface Trend { sport: Sport; multiplier: number; otherMultiplier: number; remainingMs: number; defensive: boolean; }
export interface Production { deskId: number; cardId: CardId; result: Yield; }
export interface GameEvent { id: number; deskId: number | null; at: number; text: string; views: number; cash: number; }
