import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CARDS } from "./cardData";
import { SAVE_KEY, assignCard, awardViews, calculateYield, hireStaff, initialGame, money, openPack, revealCard, sellDuplicate, sponsorCost, sponsorMultiplier, stepSecond, trendAt } from "./economy";
import { restoreSave, safeStorage } from "./persistence";
import type { CardId, GameEvent, GameSave, PackId, StaffRole, Yield } from "./types";

interface GameStore {
  game: GameSave; events: GameEvent[]; sequence: number; message: string; lastManualAt: number;
  advance: () => void; manual: (needle: number) => Yield | null; buyPack: (kind: PackId) => void;
  reveal: (index: number) => CardId | null; finishPack: () => void; sell: (id: CardId) => void;
  lock: (id: CardId) => void; assign: (id: CardId | null, desk: number | null) => boolean;
  hire: (role: StaffRole) => void; pause: (desk: number) => void; upgrade: () => void; reset: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
     game: initialGame(),
      events: [],
      sequence: 0,
      message: "Welcome, founder. Your first card and $1,000,000 are ready.",
      lastManualAt: -Infinity,
      advance: () => {
        const state = get(); const result = stepSecond(state.game); let sequence = state.sequence;
        const events = result.productions.map((production): GameEvent => ({
          id: ++sequence, deskId: production.deskId, at: performance.now(),
          text: `${CARDS[production.cardId].name} finished an edit`, views: production.result.views, cash: production.result.net,
        }));
        set({ game: result.game, sequence, events: [...state.events, ...events].slice(-30), ...(result.paused > 0 ? { message: "A desk paused due to low cash." } : {}) });
      },
      manual: (needle) => {
        const state = get(); const now = performance.now();
        if (now - state.lastManualAt < 900 || !Number.isFinite(needle) || needle < 0 || needle > 1) return null;
        const id = state.game.activeCard; const owned = state.game.inventory[id]; if (!owned) return null;
        const result = calculateYield(CARDS[id], owned.views, needle, trendAt(state.game.clockMs), sponsorMultiplier(state.game));
        const event: GameEvent = { id: state.sequence + 1, deskId: null, at: now, text: `${result.grade} release · ${CARDS[id].name}`, views: result.views, cash: result.net };
        set({ game: awardViews(state.game, id, result), sequence: event.id, events: [...state.events, event].slice(-30), lastManualAt: now, message: `${result.grade} release earned ${money(result.net)}.` });
        return result;
      },
      buyPack: (kind) => {
        const game = openPack(get().game, kind);
        if (game === get().game) { set({ message: "Finish current pack or earn more cash." }); return; }
        set({ game, message: "Pack secured. Click cards to reveal." });
      },
      reveal: (index) => {
        const previous = get().game; const game = revealCard(previous, index); if (game === previous) return null;
        const id = game.pendingPack!.cards[index].cardId; set({ game, message: `${CARDS[id].name} added.` }); return id;
      },
      finishPack: () => {
        const game = get().game; if (game.pendingPack && game.pendingPack.cards.every((card) => card.revealed)) set({ game: { ...game, pendingPack: null } });
      },
      sell: (id) => {
        const previous = get().game; const game = sellDuplicate(previous, id);
        set({ game, message: game === previous ? "Cannot sell locked or assigned cards." : `Duplicate sold for ${money(game.cash - previous.cash)}.` });
      },
      lock: (id) => {
        const game = get().game; const owned = game.inventory[id]; if (!owned) return;
        set({ game: { ...game, inventory: { ...game.inventory, [id]: { ...owned, locked: !owned.locked } } }, message: owned.locked ? "Unlocked." : "Locked." });
      },
      assign: (id, desk) => {
        const previous = get().game; const game = assignCard(previous, id, desk);
        set({ game, message: game === previous ? "No eligible copy available." : "Assignment updated." }); return game !== previous;
      },
      hire: (role) => {
        const previous = get().game; const game = hireStaff(previous, role);
        set({ game, message: game === previous ? "Need more cash or open desk." : "Editor hired." });
      },
      pause: (desk) => {
        const game = get().game; set({ game: { ...game, staff: game.staff.map((staff) => staff.id === desk && staff.cardId ? { ...staff, paused: !staff.paused } : staff) } });
      },
      upgrade: () => {
        const game = get().game; const level = game.upgrades.sponsor; const cost = sponsorCost(level);
        if (level >= 8 || game.cash < cost) { set({ message: "Upgrade unavailable." }); return; }
        set({ game: { ...game, cash: game.cash - cost, upgrades: { sponsor: level + 1 } }, message: "Sponsor deal signed." });
      },
      reset: () => { set({ game: initialGame(), events: [], sequence: 0, lastManualAt: -Infinity, message: "New agency founded." }); },
    }),
    { name: SAVE_KEY, version: 1, storage: createJSONStorage(() => safeStorage), skipHydration: true, partialize: (state) => ({ game: state.game }), merge: (persisted, current) => ({ ...current, game: restoreSave(persisted) }) }
  )
);
