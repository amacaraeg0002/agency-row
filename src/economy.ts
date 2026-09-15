import { CARDS, PACKS, PARALLELS, RARITIES, STAFF_SPECS } from "./cardData";
import { SPORTS } from "./types";
import type { Card, CardId, GameSave, Grade, PackId, Production, StaffRole, Trend, Yield } from "./types";

export const SAVE_KEY = "agency_tycoon_save_v1";
export const TICK_MS = 10_000;

export const money = (value: number): string => value.toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const compact = (value: number): string => Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format(value);

export function initialGame(): GameSave {
  return {
    cash: 1_000_000, // Boom. $1,000,000 starting cash.
    totalViews: 0,
    inventory: {
      "mlb-holliday": { count: 1, views: 0, locked: false }, // Updated to match our new ESPN roster
    },
    activeCard: "mlb-holliday",
    staff: [],
    upgrades: { sponsor: 0 },
    rng: 0x9e3779b9,
    nextId: 1,
    clockMs: 0,
    pendingPack: null,
  };
}
export function triangle(seconds: number, cycle: number): number {
  return Math.abs(2 * ((Math.max(0, seconds) / cycle) % 1) - 1);
}

export function cycleDuration(card: Card): number {
  return [1.2, 1.11, 1.02, 0.93, 0.84, 0.75][RARITIES.indexOf(card.rarity)];
}

export function timing(x: number): { grade: Grade; multiplier: number } {
  if (!Number.isFinite(x) || x < 0 || x > 1) {
    throw new RangeError("Needle position must be between zero and one.");
  }
  if (x >= 0.465 && x <= 0.535) return { grade: "Perfect", multiplier: 2.5 };
  if (x >= 0.4 && x <= 0.6) return { grade: "Good", multiplier: 1 };
  return { grade: "Flop", multiplier: 0.25 };
}

export function parallelTier(views: number): number {
  let tier = 0;
  for (let i = 1; i < PARALLELS.length; i += 1) {
    if (views / 100 >= PARALLELS[i].xp) tier = i;
  }
  return tier;
}

export function trendAt(clockMs: number): Trend {
  return {
    sport: SPORTS[Math.floor(clockMs / 180_000) % SPORTS.length],
    multiplier: 1.5,
    otherMultiplier: 0.85,
    remainingMs: 180_000 - (clockMs % 180_000),
    defensive: Math.floor(clockMs / 30_000) % 2 === 1,
  };
}

export function calculateYield(card: Card, accumulatedViews: number, needle: number | null, trend: Trend, sponsor = 1, wagePerThousand = 0): Yield {
  const release = needle === null ? { grade: "Auto" as const, multiplier: 1 } : timing(needle);
  let quirk = 1;
  if (card.quirks.includes("#GREATNESS")) quirk *= 3;
  if (card.quirks.includes("#SHOWTIME") && needle !== null && needle >= 0.49 && needle <= 0.51) {
    quirk *= 1.75;
  }
  if (card.quirks.includes("#PickSix") && trend.defensive) quirk *= 1.6;
  if (card.quirks.includes("#WalkoffKO") && release.grade === "Perfect") quirk *= 2;

  let trendMultiplier = card.sport === trend.sport ? trend.multiplier : trend.otherMultiplier;
  if (card.quirks.includes("#GREATNESS")) trendMultiplier = Math.max(1, trendMultiplier);

  const views = Math.floor(card.baseViews * release.multiplier * quirk * PARALLELS[parallelTier(accumulatedViews)].multiplier * trendMultiplier);
  const gross = (views / 1_000) * card.cpm * (needle === null ? 1 : sponsor);
  const wage = (views / 1_000) * wagePerThousand;
  return { grade: release.grade, views, gross, wage, net: gross - wage };
}

export function quicksellValue(card: Card): number {
  const ovr = card.ovr;
  const floor = ovr < 65 ? 5 : ovr < 75 ? 25 : ovr < 80 ? 100 : ovr < 85 ? 750 : ovr < 90 ? 4_000 : 10_000;
  return floor + (card.theme === "2016 Historic Collection" ? 1_500 : 0);
}

export function assignedCopies(game: GameSave, cardId: CardId, excludingDesk?: number): number {
  return Number(game.activeCard === cardId) + game.staff.filter((staff) => staff.id !== excludingDesk && staff.cardId === cardId).length;
}

export function canSell(game: GameSave, cardId: CardId): boolean {
  const owned = game.inventory[cardId];
  return Boolean(owned && !owned.locked && owned.count > Math.max(1, assignedCopies(game, cardId)));
}

export function sellDuplicate(game: GameSave, cardId: CardId): GameSave {
  if (!canSell(game, cardId)) return game;
  const owned = game.inventory[cardId]!;
  return {
    ...game,
    cash: game.cash + quicksellValue(CARDS[cardId]),
    inventory: {
      ...game.inventory,
      [cardId]: { ...owned, count: owned.count - 1 },
    },
  };
}

export function canAssign(game: GameSave, cardId: CardId, deskId: number | null): boolean {
  const owned = game.inventory[cardId];
  if (!owned) return false;
  if (deskId === null) {
    const usedByStaff = game.staff.filter((staff) => staff.cardId === cardId).length;
    return owned.count > usedByStaff;
  }
  const desk = game.staff.find((staff) => staff.id === deskId);
  if (!desk) return false;
  const rank = RARITIES.indexOf(CARDS[cardId].rarity);
  return (rank <= STAFF_SPECS[desk.role].maxRank && owned.count > assignedCopies(game, cardId, deskId));
}

export function assignCard(game: GameSave, cardId: CardId | null, deskId: number | null): GameSave {
  if (cardId === null) {
    if (deskId === null) return game;
    return {
      ...game,
      staff: game.staff.map((staff) => staff.id === deskId ? { ...staff, cardId: null, paused: true } : staff),
    };
  }
  if (!canAssign(game, cardId, deskId)) return game;
  if (deskId === null) return { ...game, activeCard: cardId };
  return {
    ...game,
    staff: game.staff.map((staff) => staff.id === deskId ? { ...staff, cardId } : staff),
  };
}

export function hireStaff(game: GameSave, role: StaffRole): GameSave {
  const spec = STAFF_SPECS[role];
  if (game.cash < spec.cost || game.staff.length >= 4) return game;
  return {
    ...game,
    cash: game.cash - spec.cost,
    nextId: game.nextId + 1,
    staff: [...game.staff, { id: game.nextId, role, cardId: null, paused: true }],
  };
}

export function sponsorCost(level: number): number {
  return 1_000 * 2 ** level;
}

export function sponsorMultiplier(game: GameSave): number {
  return 1 + game.upgrades.sponsor * 0.25;
}

export function nextRandom(seed: number): [number, number] {
  let x = seed >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  const next = x >>> 0;
  return [next, next / 4_294_967_296];
}

export function openPack(game: GameSave, kind: PackId): GameSave {
  const spec = PACKS[kind];
  if (game.pendingPack || game.cash < spec.price) return game;
  let rng = game.rng;
  const cards = Array.from({ length: spec.count }, () => {
    let value: number;
    [rng, value] = nextRandom(rng);
    let cumulative = 0;
    let cardId = spec.odds[spec.odds.length - 1][0];
    for (const [candidate, probability] of spec.odds) {
      cumulative += probability;
      if (value < cumulative) {
        cardId = candidate;
        break;
      }
    }
    return { cardId, revealed: false, duplicate: false };
  });
  return { ...game, cash: game.cash - spec.price, rng, nextId: game.nextId + 1, pendingPack: { id: game.nextId, kind, cards } };
}

export function revealCard(game: GameSave, index: number): GameSave {
  const pending = game.pendingPack;
  if (!Number.isInteger(index) || !pending) return game;
  const pulled = pending.cards[index];
  if (!pulled || pulled.revealed) return game;
  const owned = game.inventory[pulled.cardId];
  return {
    ...game,
    inventory: {
      ...game.inventory,
      [pulled.cardId]: { count: (owned?.count ?? 0) + 1, views: owned?.views ?? 0, locked: owned?.locked ?? false },
    },
    pendingPack: {
      ...pending,
      cards: pending.cards.map((card, i) => i === index ? { ...card, revealed: true, duplicate: Boolean(owned) } : card),
    },
  };
}

export function awardViews(game: GameSave, cardId: CardId, result: Yield): GameSave {
  const owned = game.inventory[cardId];
  if (!owned) return game;
  const totalViews = game.totalViews + result.views;
  const cardViews = owned.views + result.views;
  const cash = game.cash + result.net;
  if (!Number.isSafeInteger(totalViews) || !Number.isSafeInteger(cardViews) || !Number.isFinite(cash) || cash < 0 || cash > Number.MAX_SAFE_INTEGER) {
    throw new RangeError("The save has reached its numerical limit.");
  }
  return {
    ...game,
    cash,
    totalViews,
    inventory: { ...game.inventory, [cardId]: { ...owned, views: cardViews } },
  };
}

export function stepSecond(game: GameSave): { game: GameSave; productions: Production[]; paused: number } {
  let next: GameSave = { ...game, clockMs: game.clockMs + 1_000 };
  const productions: Production[] = [];
  let paused = 0;
  if (next.clockMs % TICK_MS !== 0) {
    return { game: next, productions, paused };
  }
  const trend = trendAt(next.clockMs);
  for (const desk of next.staff) {
    if (desk.paused || !desk.cardId) continue;
    const owned = next.inventory[desk.cardId];
    if (!owned) continue;
    const result = calculateYield(CARDS[desk.cardId], owned.views, null, trend, 1, STAFF_SPECS[desk.role].wage);
    if (next.cash + result.net < 0) {
      paused += 1;
      next = { ...next, staff: next.staff.map((staff) => staff.id === desk.id ? { ...staff, paused: true } : staff) };
      continue;
    }
    next = awardViews(next, desk.cardId, result);
    productions.push({ deskId: desk.id, cardId: desk.cardId, result });
  }
  return { game: next, productions, paused };
}
