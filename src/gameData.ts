import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Card, CardId, GameSave, PackId, StaffRole, GameEvent } from "./types";

export const CARDS: Record<CardId, Card> = {
  "hero-brady": { id: "hero-brady", name: "Tom Brady '17/'21", sport: "Football", rarity: "Hero", ovr: 100, baseViews: 150000, cpm: 35, theme: "Champion Heroes", quirks: ["#GREATNESS"], color: "#002244", number: "12", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/2330.png" },
  "hero-lebron": { id: "hero-lebron", name: "LeBron James '16/'20", sport: "Basketball", rarity: "Hero", ovr: 94, baseViews: 85000, cpm: 25, theme: "Champion Heroes", quirks: ["#GREATNESS", "#SHOWTIME"], color: "#552583", number: "23", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/1966.png" },
  "hero-mahomes": { id: "hero-mahomes", name: "Patrick Mahomes '20/'23/'24", sport: "Football", rarity: "Hero", ovr: 93, baseViews: 80000, cpm: 24, theme: "Champion Heroes", quirks: ["#GREATNESS"], color: "#E31837", number: "15", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png" },
  "hero-messi": { id: "hero-messi", name: "Lionel Messi '22", sport: "Soccer", rarity: "Hero", ovr: 93, baseViews: 82000, cpm: 24, theme: "Champion Heroes", quirks: ["#GREATNESS"], color: "#43A1D5", number: "10", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/45843.png" },
  
  "mlb-ohtani": { id: "mlb-ohtani", name: "Shohei Ohtani", sport: "Baseball", rarity: "Mythic", ovr: 99, baseViews: 50000, cpm: 20, theme: "Live Series", quirks: ["#GREATNESS", "#WalkoffKO"], color: "#005A9C", number: "17", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/39832.png" },
  "nba-curry": { id: "nba-curry", name: "Stephen Curry", sport: "Basketball", rarity: "Mythic", ovr: 96, baseViews: 45000, cpm: 18, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#1D428A", number: "30", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/3975.png" },
  "nfl-lamar": { id: "nfl-lamar", name: "Lamar Jackson", sport: "Football", rarity: "Mythic", ovr: 97, baseViews: 46000, cpm: 18, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#241773", number: "8", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png" },
  "nhl-mackinnon": { id: "nhl-mackinnon", name: "Nathan MacKinnon", sport: "Hockey", rarity: "Mythic", ovr: 97, baseViews: 42000, cpm: 17, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#6F263D", number: "29", imageUrl: "https://a.espncdn.com/i/headshots/nhl/players/full/3041969.png" },
  "soc-ronaldo": { id: "soc-ronaldo", name: "Cristiano Ronaldo", sport: "Soccer", rarity: "Mythic", ovr: 95, baseViews: 45000, cpm: 18, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#E32221", number: "7", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/22774.png" },
  "nba-wemby": { id: "nba-wemby", name: "Victor Wembanyama", sport: "Basketball", rarity: "Diamond", ovr: 94, baseViews: 38000, cpm: 16, theme: "Live Series", quirks: ["#PickSix"], color: "#000000", number: "1", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/5104157.png" },
  "nfl-jefferson": { id: "nfl-jefferson", name: "Justin Jefferson", sport: "Football", rarity: "Diamond", ovr: 95, baseViews: 40000, cpm: 16, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#4F2683", number: "18", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/4262921.png" },
  "mlb-judge": { id: "mlb-judge", name: "Aaron Judge", sport: "Baseball", rarity: "Mythic", ovr: 98, baseViews: 47000, cpm: 19, theme: "Live Series", quirks: ["#WalkoffKO"], color: "#003087", number: "99", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/33192.png" },
  "ten-alcaraz": { id: "ten-alcaraz", name: "Carlos Alcaraz", sport: "Tennis", rarity: "Diamond", ovr: 95, baseViews: 36000, cpm: 15, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#E5A278", number: "1", imageUrl: "https://a.espncdn.com/i/headshots/tennis/players/full/4363229.png" },
  "com-pereira": { id: "com-pereira", name: "Alex Pereira", sport: "Combat Sports", rarity: "Diamond", ovr: 94, baseViews: 38000, cpm: 15, theme: "Live Series", quirks: ["#WalkoffKO"], color: "#1D9354", number: "1", imageUrl: "https://a.espncdn.com/i/headshots/mma/players/full/4988771.png" },
  "mlb-holliday": { id: "mlb-holliday", name: "Jackson Holliday", sport: "Baseball", rarity: "Silver", ovr: 81, baseViews: 12000, cpm: 8, theme: "Live Series", quirks: [], color: "#DF4601", number: "7", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/43085.png" }
};

export const CARD_IDS = Object.keys(CARDS) as CardId[];
export const STAFF_SPECS: Record<StaffRole, { name: string; cost: number }> = { intern: { name: "Intern", cost: 15_000 }, editor: { name: "Video Editor", cost: 100_000 }, producer: { name: "Senior Producer", cost: 500_000 } };
export const PACKS: Record<PackId, { name: string; price: number; odds: [CardId, number][] }> = {
  "silver-plus": { name: "Silver+ Multi-Sport", price: 10_000, odds: [["mlb-holliday", 0.5], ["nba-wemby", 0.3], ["nfl-jefferson", 0.15], ["nba-curry", 0.05]] },
  "diamond-plus": { name: "Diamond+ Multi-Sport", price: 50_000, odds: [["nba-wemby", 0.3], ["nfl-jefferson", 0.3], ["ten-alcaraz", 0.2], ["mlb-judge", 0.1], ["mlb-ohtani", 0.1]] },
  "hero-vault": { name: "Champion Heroes Vault", price: 250_000, odds: [["hero-lebron", 0.4], ["hero-mahomes", 0.3], ["hero-messi", 0.3]] },
  "nba-pack": { name: "NBA Pack", price: 5_000, odds: [["nba-wemby", 0.8], ["nba-curry", 0.2]] },
  "nfl-pack": { name: "NFL Pack", price: 5_000, odds: [["nfl-jefferson", 0.8], ["nfl-lamar", 0.2]] },
  "mlb-pack": { name: "MLB Pack", price: 5_000, odds: [["mlb-holliday", 0.7], ["mlb-judge", 0.2], ["mlb-ohtani", 0.1]] },
  "nhl-pack": { name: "NHL Pack", price: 5_000, odds: [["nhl-mackinnon", 1.0]] },
  "soccer-pack": { name: "Soccer Pack", price: 5_000, odds: [["soc-ronaldo", 1.0]] },
  "combat-pack": { name: "Combat Pack", price: 5_000, odds: [["com-pereira", 1.0]] },
  "tennis-pack": { name: "Tennis Pack", price: 5_000, odds: [["ten-alcaraz", 1.0]] }
};

export const money = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const compact = (v: number) => Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(v);

interface GameStore {
  game: GameSave; events: GameEvent[]; message: string;
  advanceAuto: () => void; manualClip: (grade: "Flop" | "Good" | "Perfect") => void;
  buyStaff: (role: StaffRole) => void; buySponsor: () => void; buyFloor: () => void;
  buyPack: (id: PackId) => void; revealCard: () => void; setActive: (id: CardId) => void;
  claimBrady: () => void; resetGame: () => void;
}

const initialGame = (): GameSave => ({
  cash: 1_000_000, totalViews: 0, agencyXp: 0, agencyLevel: 1,
  inventory: { "mlb-ohtani": { count: 1, views: 0, locked: true } },
  activeCard: "mlb-ohtani", staff: [], upgrades: { sponsor: 0, floor: 0 },
  nextId: 1, clockMs: 0, pendingPack: null
});

export const useGameStore = create<GameStore>()(persist((set, get) => ({
  game: initialGame(), events: [], message: "Agency founded. $1M deposited.",
  
  manualClip: (grade) => {
    const { game, events } = get();
    const card = CARDS[game.activeCard];
    let mult = grade === "Perfect" ? 100 : grade === "Good" ? 10 : 1;
    const sponsorMult = 1 + (game.upgrades.sponsor * 0.25);
    
    // 150% scaled math
    const views = Math.floor((card.baseViews * 1.5) * mult);
    const cash = (views / 1000) * (card.cpm * 1.5) * sponsorMult;
    const xp = grade === "Perfect" ? 500 : grade === "Good" ? 100 : 25;

    let newXp = game.agencyXp + xp;
    let newLvl = game.agencyLevel;
    while(newXp > newLvl * 1000 * 1.5) newLvl++;

    const newEvent = { id: Date.now(), text: `Manual ${grade} Clip (${card.name})`, views, cash, isManual: true };
    set({ 
      game: { ...game, cash: game.cash + cash, totalViews: game.totalViews + views, agencyXp: newXp, agencyLevel: newLvl },
      events: [newEvent, ...events].slice(0, 50)
    });
  },

  advanceAuto: () => {
    const { game, events } = get();
    if (game.staff.length === 0) return;
    let totalCash = 0; let totalViews = 0; let totalXp = 0;
    const sponsorMult = 1 + (game.upgrades.sponsor * 0.25);

    game.staff.forEach(s => {
      const card = CARDS[s.cardId || game.activeCard]; // Fallback to active if desk empty
      const views = Math.floor((card.baseViews * 1.5) * 10); // Auto counts as 'Good' (10x)
      const cash = (views / 1000) * (card.cpm * 1.5) * sponsorMult;
      totalViews += views; totalCash += cash; totalXp += 50;
    });

    let newXp = game.agencyXp + totalXp;
    let newLvl = game.agencyLevel;
    while(newXp > newLvl * 1000 * 1.5) newLvl++;

    const newEvent = { id: Date.now(), text: `Auto-Editors generated clips`, views: totalViews, cash: totalCash, isManual: false };
    set({
      game: { ...game, cash: game.cash + totalCash, totalViews: game.totalViews + totalViews, agencyXp: newXp, agencyLevel: newLvl },
      events: [newEvent, ...events].slice(0, 50)
    });
  },

  buyStaff: (role) => {
    const game = get().game; const cost = STAFF_SPECS[role].cost;
    if (game.cash >= cost && game.staff.length < 15 + (game.upgrades.floor * 5)) {
      set({ game: { ...game, cash: game.cash - cost, nextId: game.nextId + 1, staff: [...game.staff, { id: game.nextId, role, cardId: game.activeCard, paused: false }] }});
    }
  },
  
  buySponsor: () => {
    const game = get().game; const cost = 25000 * Math.pow(2, game.upgrades.sponsor);
    if (game.cash >= cost) set({ game: { ...game, cash: game.cash - cost, upgrades: { ...game.upgrades, sponsor: game.upgrades.sponsor + 1 } }});
  },

  buyFloor: () => {
    const game = get().game; const cost = 50000 * Math.pow(2, game.upgrades.floor);
    if (game.cash >= cost) set({ game: { ...game, cash: game.cash - cost, upgrades: { ...game.upgrades, floor: game.upgrades.floor + 1 } }});
  },

  buyPack: (id) => {
    const game = get().game; const pack = PACKS[id];
    if (game.cash >= pack.price && !game.pendingPack) {
       const rand = Math.random(); let cumulative = 0; let pulledId = pack.odds[pack.odds.length - 1][0];
       for (const [cId, prob] of pack.odds) { cumulative += prob; if (rand < cumulative) { pulledId = cId; break; } }
       set({ game: { ...game, cash: game.cash - pack.price, pendingPack: { id: Date.now(), kind: id, cards: [{ cardId: pulledId, revealed: false, duplicate: false }] } }});
    }
  },

  revealCard: () => {
    const game = get().game; if (!game.pendingPack) return;
    const cardId = game.pendingPack.cards[0].cardId;
    const owned = game.inventory[cardId];
    set({ game: { ...game, pendingPack: null, inventory: { ...game.inventory, [cardId]: { count: (owned?.count || 0) + 1, views: 0, locked: true } } }});
  },

  setActive: (id) => set({ game: { ...get().game, activeCard: id } }),
  
  claimBrady: () => {
    const game = get().game;
    set({ game: { ...game, inventory: { ...game.inventory, "hero-brady": { count: 1, views: 0, locked: true } } }});
  },

  resetGame: () => set({ game: initialGame(), events: [], message: "Game Reset." })
}), { name: "agency_clicker_v1" }));
