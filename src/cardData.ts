import type { Card, CardId, PackId, Rarity, StaffRole } from "./types";

export const RARITIES: readonly Rarity[] = ["Common", "Bronze", "Silver", "Gold", "Diamond", "Mythic"];

export const PARALLELS = [
  { name: "Raw Base", xp: 0, boost: 0, multiplier: 1, className: "foil-0" },
  { name: "Bronze Foil", xp: 2_500, boost: 1, multiplier: 1.1, className: "foil-1" },
  { name: "Silver Refractor", xp: 10_000, boost: 2, multiplier: 1.25, className: "foil-2" },
  { name: "Gold Sparkle", xp: 35_000, boost: 3, multiplier: 1.45, className: "foil-3" },
  { name: "Diamond Prismatic", xp: 100_000, boost: 4, multiplier: 1.75, className: "foil-4" },
  { name: "Superfractor 1/1 Nebula", xp: 300_000, boost: 5, multiplier: 2.25, className: "foil-5" },
] as const;

export const CARDS: Record<CardId, Card> = {
  // === NBA ===
  "nba-lebron": { id: "nba-lebron", name: "LeBron James", sport: "Basketball", rarity: "Mythic", ovr: 99, baseViews: 35000, cpm: 18, theme: "Icons", quirks: ["#GREATNESS", "#SHOWTIME"], color: "#552583", number: "23", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/1966.png" },
  "nba-curry": { id: "nba-curry", name: "Stephen Curry", sport: "Basketball", rarity: "Diamond", ovr: 96, baseViews: 28000, cpm: 15, theme: "Base Live", quirks: ["#SHOWTIME"], color: "#1D428A", number: "30", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/3975.png" },
  "nba-wemby": { id: "nba-wemby", name: "Victor Wembanyama", sport: "Basketball", rarity: "Gold", ovr: 89, baseViews: 18000, cpm: 12, theme: "Base Live", quirks: ["#PickSix"], color: "#000000", number: "1", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/5104157.png" },
  "nba-ant": { id: "nba-ant", name: "Anthony Edwards", sport: "Basketball", rarity: "Silver", ovr: 88, baseViews: 15000, cpm: 10, theme: "Base Live", quirks: ["#SHOWTIME"], color: "#0C2340", number: "5", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/4592275.png" },
  
  // === NFL ===
  "nfl-mahomes": { id: "nfl-mahomes", name: "Patrick Mahomes", sport: "Football", rarity: "Mythic", ovr: 99, baseViews: 32000, cpm: 17, theme: "Icons", quirks: ["#GREATNESS"], color: "#E31837", number: "15", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png" },
  "nfl-lamar": { id: "nfl-lamar", name: "Lamar Jackson", sport: "Football", rarity: "Diamond", ovr: 97, baseViews: 25000, cpm: 14, theme: "Base Live", quirks: ["#SHOWTIME"], color: "#241773", number: "8", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png" },
  "nfl-mccaffrey": { id: "nfl-mccaffrey", name: "Christian McCaffrey", sport: "Football", rarity: "Gold", ovr: 95, baseViews: 19000, cpm: 11, theme: "Base Live", quirks: [], color: "#AA0000", number: "23", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3115350.png" },
  "nfl-jefferson": { id: "nfl-jefferson", name: "Justin Jefferson", sport: "Football", rarity: "Silver", ovr: 94, baseViews: 16000, cpm: 9, theme: "Base Live", quirks: ["#SHOWTIME"], color: "#4F2683", number: "18", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/4262921.png" },
  
  // === MLB ===
  "mlb-ohtani": { id: "mlb-ohtani", name: "Shohei Ohtani", sport: "Baseball", rarity: "Mythic", ovr: 99, baseViews: 34000, cpm: 18, theme: "Icons", quirks: ["#GREATNESS", "#WalkoffKO"], color: "#005A9C", number: "17", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/39832.png" },
  "mlb-judge": { id: "mlb-judge", name: "Aaron Judge", sport: "Baseball", rarity: "Diamond", ovr: 98, baseViews: 26000, cpm: 14, theme: "Base Live", quirks: ["#WalkoffKO"], color: "#003087", number: "99", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/33192.png" },
  "mlb-soto": { id: "mlb-soto", name: "Juan Soto", sport: "Baseball", rarity: "Gold", ovr: 96, baseViews: 17000, cpm: 11, theme: "Base Live", quirks: [], color: "#003087", number: "22", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/36969.png" },
  "mlb-holliday": { id: "mlb-holliday", name: "Jackson Holliday", sport: "Baseball", rarity: "Common", ovr: 72, baseViews: 300, cpm: 1.5, theme: "Base Live", quirks: [], color: "#DF4601", number: "7", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/43085.png" },

  // === SOCCER ===
  "soc-messi": { id: "soc-messi", name: "Lionel Messi", sport: "Soccer", rarity: "Mythic", ovr: 99, baseViews: 38000, cpm: 19, theme: "Icons", quirks: ["#GREATNESS"], color: "#F7B5CD", number: "10", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/45843.png" },
  "soc-ronaldo": { id: "soc-ronaldo", name: "Cristiano Ronaldo", sport: "Soccer", rarity: "Diamond", ovr: 96, baseViews: 31000, cpm: 16, theme: "Base Live", quirks: ["#SHOWTIME"], color: "#E32221", number: "7", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/22774.png" },
  "soc-mbappe": { id: "soc-mbappe", name: "Kylian Mbappé", sport: "Soccer", rarity: "Gold", ovr: 95, baseViews: 21000, cpm: 12, theme: "Base Live", quirks: [], color: "#004170", number: "9", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/229804.png" },
  "soc-bellingham": { id: "soc-bellingham", name: "Jude Bellingham", sport: "Soccer", rarity: "Silver", ovr: 93, baseViews: 17000, cpm: 10, theme: "Base Live", quirks: ["#WalkoffKO"], color: "#FEBE10", number: "5", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/290825.png" },
};

export const CARD_IDS = Object.keys(CARDS) as CardId[];

export function isCardId(value: unknown): value is string {
  return typeof value === "string" && Object.hasOwn(CARDS, value);
}

export const STAFF_ROLES: readonly StaffRole[] = ["intern", "editor", "producer"];

export const STAFF_SPECS: Record<StaffRole, { name: string; cost: number; wage: number; maxRank: number }> = {
  intern: { name: "Intern", cost: 500, wage: 10, maxRank: 2 },
  editor: { name: "Staff Editor", cost: 2_500, wage: 35, maxRank: 3 },
  producer: { name: "Senior Producer", cost: 10_000, wage: 120, maxRank: 5 },
};

interface PackSpec {
  name: string; price: number; count: number; description: string;
  odds: readonly (readonly [CardId, number])[];
}

export const PACKS: Record<PackId, PackSpec> = {
  starter: {
    name: "Prospect Starter Pack", price: 250, count: 3, description: "Three cards. Mostly prospects with a small shot at greatness.",
    odds: [
      ["mlb-holliday", 0.60],
      ["nba-ant", 0.20],
      ["nfl-jefferson", 0.15],
      ["soc-bellingham", 0.04],
      ["nba-wemby", 0.009],
      ["mlb-judge", 0.001],
    ],
  },
  marquee: {
    name: "Marquee Star Box", price: 5_000, count: 2, description: "Guaranteed high-tier players. Build your championship roster.",
    odds: [
      ["nfl-mccaffrey", 0.35],
      ["mlb-soto", 0.30],
      ["soc-mbappe", 0.20],
      ["nfl-lamar", 0.10],
      ["nba-curry", 0.04],
      ["soc-ronaldo", 0.01],
    ],
  },
  legends: {
    name: "Iconic Vault", price: 25_000, count: 1, description: "One card. Only the absolute greatest of all time.",
    odds: [
      ["nba-curry", 0.40],
      ["mlb-judge", 0.35],
      ["nba-lebron", 0.10],
      ["nfl-mahomes", 0.10],
      ["mlb-ohtani", 0.03],
      ["soc-messi", 0.02],
    ],
  }
};

export const QUIRK_DESCRIPTIONS = {
  "#GREATNESS": "3× views. Immune to negative trends.",
  "#SHOWTIME": "1.75× views when the needle lands from 0.49 through 0.51.",
  "#PickSix": "1.6× views during defensive highlight cycles.",
  "#WalkoffKO": "2× views on Perfect manual releases.",
} as const;
