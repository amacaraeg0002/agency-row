import { CARDS, PACKS, PARALLELS, STAFF_SPECS } from "./cardData";
import { SPORTS } from "./types";
import type { Card, CardId, GameSave, Grade, PackId, Production, StaffRole, Trend, Yield } from "./types";

export const SAVE_KEY = "agency_tycoon_save_final";
export const TICK_MS = 10_000;

export const money = (value: number): string => value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const compact = (value: number): string => Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export function initialGame(): GameSave {
  return {
    cash: 1_000_000, totalViews: 0, agencyXp: 0, agencyLevel: 1,
    inventory: { "mlb-ohtani": { count: 1, views: 1_000_000, locked: true } },
    activeCard: "mlb-ohtani", staff: [], upgrades: { sponsor: 0, floor: 0 },
    nextId: 1, clockMs: 0, pendingPack: null,
  };
}

export function levelThreshold(level: number) { return level * 1000 * Math.pow(1.5, level - 1); }
export function cycleDuration(): number { return 1.2; }
export function triangle(seconds: number, cycle: number): number { return Math.abs(2 * ((Math.max(0, seconds) / cycle) % 1) - 1); }

export function timing(x: number): { grade: Grade; multiplier: number } {
  if (x >= 0.45 && x <= 0.55) return { grade: "Perfect", multiplier: 100 };
  if (x >= 0.35 && x <= 0.65) return { grade: "Good", multiplier: 10 };
  return { grade: "Flop", multiplier: 1 };
}

export function parallelTier(views: number): number {
  let tier = 0;
  for (let i = 1; i < PARALLELS.length; i += 1) { if (views >= PARALLELS[i].xp) tier = i; }
  return tier;
}

export function trendAt(clockMs: number): Trend {
  return { sport: SPORTS[Math.floor(clockMs / 180_000) % SPORTS.length], multiplier: 2.0, otherMultiplier: 1.0, remainingMs: 180_000 - (clockMs % 180_000), defensive: Math.floor(clockMs / 30_000) % 2 === 1 };
}

export function calculateYield(card: Card, accumulatedViews: number, needle: number | null, trend: Trend, sponsor = 1): Yield {
  const release = needle === null ? { grade: "Auto" as const, multiplier: 1 } : timing(needle);
  let quirk = 1;
  if (card.quirks.includes("#GREATNESS")) quirk *= 3;
  if (card.quirks.includes("#SHOWTIME") && needle !== null && needle >= 0.49 && needle <= 0.51) quirk *= 2;
  if (card.quirks.includes("#PickSix") && trend.defensive) quirk *= 2;
  if (card.quirks.includes("#WalkoffKO") && release.grade === "Perfect") quirk *= 3;

  let trendMultiplier = card.sport === trend.sport ? trend.multiplier : trend.otherMultiplier;
  if (card.quirks.includes("#GREATNESS")) trendMultiplier = Math.max(1.5, trendMultiplier);

  const scaledBase = card.baseViews * 1.5;
  const views = Math.floor(scaledBase * release.multiplier * quirk * PARALLELS[parallelTier(accumulatedViews)].multiplier * trendMultiplier);
  const gross = (views / 1_000) * (card.cpm * 1.5) * (needle === null ? 1 : sponsor);
  const xp = needle === null ? 50 : (release.grade === "Perfect" ? 1000 : release.grade === "Good" ? 250 : 100);
  
  return { grade: release.grade, views, gross, net: gross, xp }; // No wages subtracted!
}

export function floorCost(level: number): number { return 25_000 * 2 ** level; }
export function floorSize(level: number): number { return 15 + (level * 10); }
export function quicksellValue(card: Card): number { return card.ovr < 85 ? 500 : card.ovr < 92 ? 5000 : card.ovr < 96 ? 25000 : 100000; }
export function assignedCopies(game: GameSave, cardId: CardId, excludingDesk?: number): number { return Number(game.activeCard === cardId) + game.staff.filter((s) => s.id !== excludingDesk && s.cardId === cardId).length; }
export function canSell(game: GameSave, cardId: CardId): boolean { const owned = game.inventory[cardId]; return Boolean(owned && !owned.locked && owned.count > Math.max(1, assignedCopies(game, cardId))); }

export function assignCard(game: GameSave, cardId: CardId | null, deskId: number | null): GameSave {
  if (cardId === null) return deskId === null ? game : { ...game, staff: game.staff.map((s) => s.id === deskId ? { ...s, cardId: null, paused: true } : s) };
  return deskId === null ? { ...game, activeCard: cardId } : { ...game, staff: game.staff.map((s) => s.id === deskId ? { ...s, cardId } : s) };
}

export function hireStaff(game: GameSave, role: StaffRole): GameSave {
  const spec = STAFF_SPECS[role];
  if (game.cash < spec.cost) return game;
  return { ...game, cash: game.cash - spec.cost, nextId: game.nextId + 1, staff: [...game.staff, { id: game.nextId, role, cardId: null, paused: true }] };
}

export function openPack(game: GameSave, kind: PackId): GameSave {
  const spec = PACKS[kind];
  if (game.pendingPack || game.cash < spec.price) return game;
  const cards = Array.from({ length: spec.count }, () => {
    const value = Math.random(); // True RNG
    let cumulative = 0; let cardId = spec.odds[spec.odds.length - 1][0];
    for (const [candidate, prob] of spec.odds) {
      cumulative += prob; if (value < cumulative) { cardId = candidate; break; }
    }
    return { cardId, revealed: false, duplicate: false };
  });
  return { ...game, cash: game.cash - spec.price, nextId: game.nextId + 1, pendingPack: { id: game.nextId, kind, cards } };
}

export function awardViews(game: GameSave, cardId: CardId, result: Yield): GameSave {
  const owned = game.inventory[cardId]; if (!owned) return game;
  let newXp = game.agencyXp + result.xp;
  let newLvl = game.agencyLevel;
  while (newXp >= levelThreshold(newLvl)) { newLvl++; }
  return { ...game, cash: game.cash + result.net, totalViews: game.totalViews + result.views, agencyXp: newXp, agencyLevel: newLvl, inventory: { ...game.inventory, [cardId]: { ...owned, views: owned.views + result.views } } };
}

export function stepSecond(game: GameSave): { game: GameSave; productions: Production[] } {
  let next: GameSave = { ...game, clockMs: game.clockMs + 1_000 };
  const productions: Production[] = [];
  if (next.clockMs % TICK_MS !== 0) return { game: next, productions };
  const trend = trendAt(next.clockMs); const sponsor = 1 + next.upgrades.sponsor * 0.25;
  for (const desk of next.staff) {
    if (desk.paused || !desk.cardId) continue;
    const owned = next.inventory[desk.cardId]; if (!owned) continue;
    const result = calculateYield(CARDS[desk.cardId], owned.views, null, trend, sponsor);
    next = awardViews(next, desk.cardId, result); productions.push({ deskId: desk.id, cardId: desk.cardId, result });
  }
  return { game: next, productions };
}
