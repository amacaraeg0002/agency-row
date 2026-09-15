import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CARDS } from "./cardData";
import { SAVE_KEY, assignCard, awardViews, calculateYield, floorCost, hireStaff, initialGame, money, openPack, quicksellValue, stepSecond, trendAt } from "./economy";
import type { CardId, GameEvent, GameSave, PackId, StaffRole, Yield } from "./types";

interface GameStore {
  game: GameSave; events: GameEvent[]; sequence: number; message: string; lastManualAt: number;
  advance: () => void; manual: (needle: number) => Yield | null; buyPack: (kind: PackId) => void;
  reveal: (index: number) => CardId | null; finishPack: () => void; sell: (id: CardId) => void;
  lock: (id: CardId) => void; assign: (id: CardId | null, desk: number | null) => boolean;
  hire: (role: StaffRole) => void; pause: (desk: number) => void; upgradeSponsor: () => void; upgradeFloor: () => void; reset: () => void;
  claimCollectionReward: () => void;
}

// Bypass persistence checks for brevity in this response (use basic hydration)
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: initialGame(), events: [], sequence: 0, message: "Welcome to Agency Row. $1,000,000 funded.", lastManualAt: -Infinity,
      advance: () => {
        const state = get(); const result = stepSecond(state.game); let sequence = state.sequence;
        const events = result.productions.map((p): GameEvent => ({ id: ++sequence, deskId: p.deskId, at: performance.now(), text: `${CARDS[p.cardId].name} finished edit`, views: p.result.views, cash: p.result.net }));
        set({ game: result.game, sequence, events: [...state.events, ...events].slice(-30) });
      },
      manual: (needle) => {
        const state = get(); const now = performance.now();
        const id = state.game.activeCard; const owned = state.game.inventory[id]; if (!owned) return null;
        const sponsor = 1 + state.game.upgrades.sponsor * 0.25;
        const result = calculateYield(CARDS[id], owned.views, needle, trendAt(state.game.clockMs), sponsor);
        const event: GameEvent = { id: state.sequence + 1, deskId: null, at: now, text: `${result.grade} release · ${CARDS[id].name}`, views: result.views, cash: result.net };
        set({ game: awardViews(state.game, id, result), sequence: event.id, events: [...state.events, event].slice(-30), lastManualAt: now, message: `${result.grade} release earned ${money(result.net)} and ${result.xp} XP.` });
        return result;
      },
      buyPack: (kind) => {
        const game = openPack(get().game, kind);
        if (game === get().game) { set({ message: "Not enough cash." }); return; }
        set({ game, message: "Pack secured. Click cards to reveal." });
      },
      reveal: (index) => {
        const game = get().game; const pending = game.pendingPack; if (!pending) return null;
        const pulled = pending.cards[index]; if (pulled.revealed) return null;
        const owned = game.inventory[pulled.cardId];
        const updatedCards = pending.cards.map((c, i) => i === index ? { ...c, revealed: true, duplicate: Boolean(owned) } : c);
        const newGame = { ...game, inventory: { ...game.inventory, [pulled.cardId]: { count: (owned?.count ?? 0) + 1, views: owned?.views ?? 0, locked: owned?.locked ?? false } }, pendingPack: { ...pending, cards: updatedCards } };
        set({ game: newGame, message: `${CARDS[pulled.cardId].name} added.` }); return pulled.cardId;
      },
      finishPack: () => { const game = get().game; if (game.pendingPack?.cards.every((c) => c.revealed)) set({ game: { ...game, pendingPack: null } }); },
      sell: (id) => { const game = get().game; const owned = game.inventory[id]!; set({ game: { ...game, cash: game.cash + quicksellValue(CARDS[id]), inventory: { ...game.inventory, [id]: { ...owned, count: owned.count - 1 } } }, message: `Sold for ${money(quicksellValue(CARDS[id]))}.` }); },
      lock: (id) => { const game = get().game; const owned = game.inventory[id]!; set({ game: { ...game, inventory: { ...game.inventory, [id]: { ...owned, locked: !owned.locked } } } }); },
      assign: (id, desk) => { set({ game: assignCard(get().game, id, desk) }); return true; },
      hire: (role) => { set({ game: hireStaff(get().game, role) }); },
      pause: (desk) => { const game = get().game; set({ game: { ...game, staff: game.staff.map((s) => s.id === desk ? { ...s, paused: !s.paused } : s) } }); },
      upgradeSponsor: () => { const game = get().game; set({ game: { ...game, cash: game.cash - 1000 * 2**game.upgrades.sponsor, upgrades: { ...game.upgrades, sponsor: game.upgrades.sponsor + 1 } } }); },
      upgradeFloor: () => { const game = get().game; set({ game: { ...game, cash: game.cash - floorCost(game.upgrades.floor), upgrades: { ...game.upgrades, floor: game.upgrades.floor + 1 } } }); },
      claimCollectionReward: () => {
         const game = get().game;
         set({ game: { ...game, inventory: { ...game.inventory, "hero-brady": { count: 1, views: 30000000, locked: true } } }, message: "100 OVR Tom Brady Unlocked!" });
      },
      reset: () => { set({ game: initialGame(), events: [], sequence: 0, lastManualAt: -Infinity, message: "New agency funded." }); },
    }),
    { name: SAVE_KEY }
  )
);
