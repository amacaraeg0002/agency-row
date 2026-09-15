import type { StateStorage } from "zustand/middleware";
import { CARD_IDS, CARDS, PACKS, STAFF_ROLES, isCardId } from "./cardData";
import { assignedCopies, canAssign, initialGame } from "./economy";
import type { GameSave, StaffRole } from "./types";

let storageIssue = "";

export function getStorageIssue(): string { return storageIssue; }
export function recordStorageIssue(message: string): void { storageIssue = message; }

function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function integer(value: unknown, min = 0): value is number { return Number.isSafeInteger(value) && (value as number) >= min; }
function finite(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER; }

export function validSave(value: unknown): value is GameSave {
  if (!record(value)) return false;
  if (!finite(value.cash) || !integer(value.totalViews) || !integer(value.clockMs) || value.clockMs % 1_000 !== 0 || !integer(value.nextId, 1) || !integer(value.rng, 1) || value.rng > 0xffffffff || !isCardId(value.activeCard) || !record(value.inventory) || !record(value.upgrades) || !integer(value.upgrades.sponsor) || value.upgrades.sponsor > 8 || !Array.isArray(value.staff) || value.staff.length > 4) { return false; }
  
  let summedViews = 0;
  for (const [id, owned] of Object.entries(value.inventory)) {
    if (!isCardId(id) || !record(owned) || !integer(owned.count, 1) || !integer(owned.views) || typeof owned.locked !== "boolean") return false;
    summedViews += owned.views;
  }
  if (summedViews !== value.totalViews || !value.inventory[value.activeCard]) return false;

  const ids = new Set<number>();
  for (const staff of value.staff) {
    if (!record(staff) || !integer(staff.id, 1) || staff.id >= value.nextId || ids.has(staff.id) || !STAFF_ROLES.includes(staff.role as StaffRole) || typeof staff.paused !== "boolean" || (staff.cardId !== null && !isCardId(staff.cardId))) return false;
    ids.add(staff.id);
  }

  if (value.pendingPack !== null) {
    const pack = value.pendingPack;
    if (!record(pack) || !integer(pack.id, 1) || pack.id >= value.nextId || ids.has(pack.id) || (pack.kind !== "starter" && pack.kind !== "marquee") || !Array.isArray(pack.cards) || pack.cards.length !== PACKS[pack.kind].count) return false;
    const allowed = PACKS[pack.kind].odds.map(([id]) => id);
    for (const pulled of pack.cards) {
      if (!record(pulled) || !isCardId(pulled.cardId) || !allowed.includes(pulled.cardId) || typeof pulled.revealed !== "boolean" || typeof pulled.duplicate !== "boolean" || (pulled.revealed && !value.inventory[pulled.cardId])) return false;
    }
  }

  const game = value as unknown as GameSave;
  for (const cardId of CARD_IDS) {
    if (assignedCopies(game, cardId) > (game.inventory[cardId]?.count ?? 0)) return false;
  }
  for (const staff of game.staff) {
    if (staff.cardId && (!CARDS[staff.cardId] || !canAssign(game, staff.cardId, staff.id))) return false;
  }
  return true;
}

export function restoreSave(persisted: unknown): GameSave {
  if (record(persisted) && validSave(persisted.game)) return persisted.game;
  storageIssue = "The stored save was invalid. A new game was loaded.";
  return initialGame();
}

export const safeStorage: StateStorage = {
  getItem(name) {
    try {
      const raw = localStorage.getItem(name);
      if (raw === null) return null;
      try { JSON.parse(raw); return raw; } catch { storageIssue = "The saved JSON is unreadable."; return null; }
    } catch { storageIssue = "Browser storage is unavailable."; return null; }
  },
  setItem(name, value) { try { localStorage.setItem(name, value); } catch {} },
  removeItem(name) { try { localStorage.removeItem(name); } catch {} },
};
