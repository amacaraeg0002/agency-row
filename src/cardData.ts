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
  rookie: {
    id: "rookie",
    name: "Jackson Holliday",
    sport: "Baseball",
    rarity: "Common",
    ovr: 62,
    baseViews: 300,
    cpm: 1.5,
    theme: "Base Live",
    quirks: [],
    color: "#e86b24",
    number: "07",
    imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/43085.png",
  },
  comeback: {
    id: "comeback",
    name: "LeBron James",
    sport: "Basketball",
    rarity: "Mythic",
    ovr: 99,
    baseViews: 35_000,
    cpm: 18,
    theme: "2016 Historic Collection",
    quirks: ["#GREATNESS", "#SHOWTIME"],
    color: "#552583",
    number: "23",
    imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/1966.png",
  },
  gunslinger: {
    id: "gunslinger",
    name: "Patrick Mahomes",
    sport: "Football",
    rarity: "Diamond",
    ovr: 88,
    baseViews: 12_000,
    cpm: 9.5,
    theme: "Base Live",
    quirks: ["#PickSix"],
    color: "#e31837",
    number: "15",
    imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png",
  },
  maestro: {
    id: "maestro",
    name: "Lionel Messi",
    sport: "Soccer",
    rarity: "Gold",
    ovr: 82,
    baseViews: 4_000,
    cpm: 5,
    theme: "Base Live",
    quirks: [],
    color: "#7fb3d5",
    number: "10",
    imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/45843.png",
  },
  brawler: {
    id: "brawler",
    name: "Conor McGregor",
    sport: "Combat Sports",
    rarity: "Silver",
    ovr: 77,
    baseViews: 1_800,
    cpm: 3.25,
    theme: "Base Live",
    quirks: ["#WalkoffKO"],
    color: "#1d9354",
    number: "01",
    imageUrl: "https://a.espncdn.com/i/headshots/mma/players/full/3022677.png",
  },
  phenom: {
    id: "phenom",
    name: "Carlos Alcaraz",
    sport: "Tennis",
    rarity: "Bronze",
    ovr: 71,
    baseViews: 800,
    cpm: 2.1,
    theme: "Base Live",
    quirks: [],
    color: "#e5a278",
    number: "03",
    imageUrl: "https://a.espncdn.com/i/headshots/tennis/players/full/4363229.png",
  },
  "historic-tennis": {
    id: "historic-tennis",
    name: "Roger Federer",
    sport: "Tennis",
    rarity: "Bronze",
    ovr: 74,
    baseViews: 950,
    cpm: 2.4,
    theme: "2016 Historic Collection",
    quirks: [],
    color: "#eab58a",
    number: "16",
    imageUrl: "https://a.espncdn.com/i/headshots/tennis/players/full/425.png",
  },
  "historic-combat": {
    id: "historic-combat",
    name: "Nate Diaz",
    sport: "Combat Sports",
    rarity: "Silver",
    ovr: 79,
    baseViews: 2_200,
    cpm: 3.6,
    theme: "2016 Historic Collection",
    quirks: ["#WalkoffKO"],
    color: "#b3d7dd",
    number: "209",
    imageUrl: "https://a.espncdn.com/i/headshots/mma/players/full/2335639.png",
  },
  "historic-soccer": {
    id: "historic-soccer",
    name: "Cristiano Ronaldo",
    sport: "Soccer",
    rarity: "Gold",
    ovr: 84,
    baseViews: 5_000,
    cpm: 5.5,
    theme: "2016 Historic Collection",
    quirks: [],
    color: "#97262c",
    number: "07",
    imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/22774.png",
  },
  "historic-football": {
    id: "historic-football",
    name: "Tom Brady",
    sport: "Football",
    rarity: "Diamond",
    ovr: 89,
    baseViews: 14_000,
    cpm: 10,
    theme: "2016 Historic Collection",
    quirks: ["#PickSix"],
    color: "#002244",
    number: "12",
    imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/2330.png",
  },
};

export const CARD_IDS = Object.keys(CARDS) as CardId[];

export function isCardId(value: unknown): value is CardId {
  return typeof value === "string" && Object.hasOwn(CARDS, value);
}

export const STAFF_ROLES: readonly StaffRole[] = ["intern", "editor", "producer"];

export const STAFF_SPECS: Record<
  StaffRole,
  { name: string; cost: number; wage: number; maxRank: number }
> = {
  intern: { name: "Intern", cost: 500, wage: 10, maxRank: 2 },
  editor: { name: "Staff Editor", cost: 2_500, wage: 35, maxRank: 3 },
  producer: { name: "Senior Producer", cost: 10_000, wage: 120, maxRank: 5 },
};

interface PackSpec {
  name: string;
  price: number;
  count: number;
  description: string;
  odds: readonly (readonly [CardId, number])[];
}

export const PACKS: Record<PackId, PackSpec> = {
  starter: {
    name: "Prospect Starter Pack",
    price: 250,
    count: 3,
    description: "Three cards. A small beginning. An outside shot at greatness.",
    odds: [
      ["rookie", 0.595],
      ["phenom", 0.28],
      ["brawler", 0.1],
      ["maestro", 0.02],
      ["gunslinger", 0.0045],
      ["comeback", 0.0005],
    ],
  },
  marquee: {
    name: "Marquee 2016 Vault Box",
    price: 5_000,
    count: 2,
    description: "Two historic cards. Every pull belongs to the 2016 collection.",
    odds: [
      ["historic-tennis", 0.4],
      ["historic-combat", 0.36],
      ["historic-soccer", 0.18],
      ["historic-football", 0.05],
      ["comeback", 0.01],
    ],
  },
};

export const QUIRK_DESCRIPTIONS = {
  "#GREATNESS": "3× views. Immune to negative trends.",
  "#SHOWTIME": "1.75× views when the needle lands from 0.49 through 0.51.",
  "#PickSix": "1.6× views during defensive highlight cycles.",
  "#WalkoffKO": "2× views on Perfect manual releases.",
} as const;
