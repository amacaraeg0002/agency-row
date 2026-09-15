export const SPORTS = ["Basketball", "Baseball", "Football", "Hockey", "Soccer", "Tennis", "Combat Sports"] as const;
export type Sport = (typeof SPORTS)[number];
export type Rarity = "Common" | "Bronze" | "Silver" | "Gold" | "Diamond" | "Mythic" | "Hero";
export type CardId = string;
export type Theme = "Live Series" | "Champion Heroes";
export type PackId = "nba-pack" | "nfl-pack" | "mlb-pack" | "nhl-pack" | "soccer-pack" | "combat-pack" | "tennis-pack" | "silver-plus" | "diamond-plus" | "hero-vault";
export type StaffRole = "intern" | "editor" | "producer";

export interface Card { id: CardId; name: string; sport: Sport; rarity: Rarity; ovr: number; baseViews: number; cpm: number; theme: Theme; quirks: readonly string[]; color: string; number: string; imageUrl: string; }
export interface OwnedCard { count: number; views: number; locked: boolean; }
export interface Staff { id: number; role: StaffRole; cardId: CardId | null; paused: boolean; }
export interface PackCard { cardId: CardId; revealed: boolean; duplicate: boolean; }
export interface GameSave { cash: number; totalViews: number; agencyXp: number; agencyLevel: number; inventory: Partial<Record<CardId, OwnedCard>>; activeCard: CardId; staff: Staff[]; upgrades: { sponsor: number; floor: number; }; nextId: number; clockMs: number; pendingPack: { id: number; kind: PackId; cards: PackCard[]; } | null; }
export interface GameEvent { id: number; text: string; views: number; cash: number; isManual: boolean; }
