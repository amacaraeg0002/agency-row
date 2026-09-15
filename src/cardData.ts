import type { Card, CardId, PackId, Rarity, StaffRole } from "./types";

export const RARITIES: readonly Rarity[] = ["Common", "Bronze", "Silver", "Gold", "Diamond", "Mythic", "Hero"];

export const PARALLELS = [
  { name: "Raw Base", xp: 0, boost: 0, multiplier: 1, className: "foil-0" },
  { name: "Bronze Foil", xp: 5_000, boost: 1, multiplier: 1.1, className: "foil-1" },
  { name: "Silver Refractor", xp: 20_000, boost: 2, multiplier: 1.25, className: "foil-2" },
  { name: "Gold Sparkle", xp: 75_000, boost: 3, multiplier: 1.45, className: "foil-3" },
  { name: "Diamond Prismatic", xp: 250_000, boost: 4, multiplier: 1.75, className: "foil-4" },
  { name: "Superfractor 1/1 Nebula", xp: 1_000_000, boost: 5, multiplier: 2.25, className: "foil-5" },
] as const;

export const CARDS: Record<CardId, Card> = {
  // === CHAMPION HEROES (2016-2026 MVPs) ===
  "hero-brady": { id: "hero-brady", name: "Tom Brady '17/'21", sport: "Football", rarity: "Hero", ovr: 100, baseViews: 150000, cpm: 35, theme: "Champion Heroes", quirks: ["#GREATNESS"], color: "#002244", number: "12", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/2330.png" },
  "hero-lebron": { id: "hero-lebron", name: "LeBron James '16/'20", sport: "Basketball", rarity: "Hero", ovr: 94, baseViews: 85000, cpm: 25, theme: "Champion Heroes", quirks: ["#GREATNESS", "#SHOWTIME"], color: "#552583", number: "23", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/1966.png" },
  "hero-mahomes": { id: "hero-mahomes", name: "Patrick Mahomes '20/'23/'24", sport: "Football", rarity: "Hero", ovr: 93, baseViews: 80000, cpm: 24, theme: "Champion Heroes", quirks: ["#GREATNESS"], color: "#E31837", number: "15", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png" },
  "hero-messi": { id: "hero-messi", name: "Lionel Messi '22", sport: "Soccer", rarity: "Hero", ovr: 93, baseViews: 82000, cpm: 24, theme: "Champion Heroes", quirks: ["#GREATNESS"], color: "#43A1D5", number: "10", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/45843.png" },
  "hero-mcdavid": { id: "hero-mcdavid", name: "Connor McDavid '24", sport: "Hockey", rarity: "Hero", ovr: 91, baseViews: 70000, cpm: 20, theme: "Champion Heroes", quirks: ["#SHOWTIME"], color: "#FF4C00", number: "97", imageUrl: "https://a.espncdn.com/i/headshots/nhl/players/full/3041696.png" },
  "hero-jokic": { id: "hero-jokic", name: "Nikola Jokic '23", sport: "Basketball", rarity: "Hero", ovr: 91, baseViews: 71000, cpm: 21, theme: "Champion Heroes", quirks: [], color: "#0E2240", number: "15", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/3112335.png" },
  "hero-seager": { id: "hero-seager", name: "Corey Seager '20/'23", sport: "Baseball", rarity: "Hero", ovr: 90, baseViews: 65000, cpm: 19, theme: "Champion Heroes", quirks: ["#WalkoffKO"], color: "#003279", number: "5", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/32691.png" },
  "hero-jones": { id: "hero-jones", name: "Jon Jones '23", sport: "Combat Sports", rarity: "Hero", ovr: 90, baseViews: 66000, cpm: 19, theme: "Champion Heroes", quirks: ["#WalkoffKO"], color: "#000000", number: "1", imageUrl: "https://a.espncdn.com/i/headshots/mma/players/full/2335639.png" }, // fallback image used if missing

  // === LIVE SERIES: NBA ===
  "nba-curry": { id: "nba-curry", name: "Stephen Curry", sport: "Basketball", rarity: "Mythic", ovr: 96, baseViews: 45000, cpm: 18, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#1D428A", number: "30", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/3975.png" },
  "nba-luka": { id: "nba-luka", name: "Luka Doncic", sport: "Basketball", rarity: "Mythic", ovr: 96, baseViews: 44000, cpm: 17, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#00538C", number: "77", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/3945274.png" },
  "nba-wemby": { id: "nba-wemby", name: "Victor Wembanyama", sport: "Basketball", rarity: "Diamond", ovr: 92, baseViews: 35000, cpm: 15, theme: "Live Series", quirks: ["#PickSix"], color: "#000000", number: "1", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/5104157.png" },
  "nba-ant": { id: "nba-ant", name: "Anthony Edwards", sport: "Basketball", rarity: "Diamond", ovr: 91, baseViews: 32000, cpm: 14, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#0C2340", number: "5", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/4592275.png" },
  "nba-shai": { id: "nba-shai", name: "Shai Gilgeous-Alexander", sport: "Basketball", rarity: "Gold", ovr: 90, baseViews: 28000, cpm: 12, theme: "Live Series", quirks: [], color: "#007AC1", number: "2", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/4278073.png" },
  "nba-tatum": { id: "nba-tatum", name: "Jayson Tatum", sport: "Basketball", rarity: "Gold", ovr: 90, baseViews: 27500, cpm: 12, theme: "Live Series", quirks: [], color: "#007A33", number: "0", imageUrl: "https://a.espncdn.com/i/headshots/nba/players/full/4065648.png" },

  // === LIVE SERIES: NFL ===
  "nfl-lamar": { id: "nfl-lamar", name: "Lamar Jackson", sport: "Football", rarity: "Mythic", ovr: 97, baseViews: 46000, cpm: 18, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#241773", number: "8", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png" },
  "nfl-mccaffrey": { id: "nfl-mccaffrey", name: "Christian McCaffrey", sport: "Football", rarity: "Diamond", ovr: 96, baseViews: 42000, cpm: 17, theme: "Live Series", quirks: [], color: "#AA0000", number: "23", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3115350.png" },
  "nfl-jefferson": { id: "nfl-jefferson", name: "Justin Jefferson", sport: "Football", rarity: "Diamond", ovr: 95, baseViews: 40000, cpm: 16, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#4F2683", number: "18", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/4262921.png" },
  "nfl-allen": { id: "nfl-allen", name: "Josh Allen", sport: "Football", rarity: "Gold", ovr: 92, baseViews: 32000, cpm: 13, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#00338D", number: "17", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png" },
  "nfl-stroud": { id: "nfl-stroud", name: "C.J. Stroud", sport: "Football", rarity: "Silver", ovr: 88, baseViews: 20000, cpm: 10, theme: "Live Series", quirks: [], color: "#03202F", number: "7", imageUrl: "https://a.espncdn.com/i/headshots/nfl/players/full/4432734.png" },

  // === LIVE SERIES: MLB ===
  "mlb-ohtani": { id: "mlb-ohtani", name: "Shohei Ohtani", sport: "Baseball", rarity: "Mythic", ovr: 99, baseViews: 50000, cpm: 20, theme: "Live Series", quirks: ["#GREATNESS", "#WalkoffKO"], color: "#005A9C", number: "17", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/39832.png" },
  "mlb-judge": { id: "mlb-judge", name: "Aaron Judge", sport: "Baseball", rarity: "Mythic", ovr: 98, baseViews: 47000, cpm: 19, theme: "Live Series", quirks: ["#WalkoffKO"], color: "#003087", number: "99", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/33192.png" },
  "mlb-soto": { id: "mlb-soto", name: "Juan Soto", sport: "Baseball", rarity: "Diamond", ovr: 95, baseViews: 38000, cpm: 15, theme: "Live Series", quirks: [], color: "#003087", number: "22", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/36969.png" },
  "mlb-harper": { id: "mlb-harper", name: "Bryce Harper", sport: "Baseball", rarity: "Gold", ovr: 92, baseViews: 31000, cpm: 13, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#E81828", number: "3", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/31669.png" },
  "mlb-holliday": { id: "mlb-holliday", name: "Jackson Holliday", sport: "Baseball", rarity: "Silver", ovr: 81, baseViews: 12000, cpm: 8, theme: "Live Series", quirks: [], color: "#DF4601", number: "7", imageUrl: "https://a.espncdn.com/i/headshots/mlb/players/full/43085.png" },

  // === LIVE SERIES: NHL ===
  "nhl-mackinnon": { id: "nhl-mackinnon", name: "Nathan MacKinnon", sport: "Hockey", rarity: "Mythic", ovr: 97, baseViews: 42000, cpm: 17, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#6F263D", number: "29", imageUrl: "https://a.espncdn.com/i/headshots/nhl/players/full/3041969.png" },
  "nhl-matthews": { id: "nhl-matthews", name: "Auston Matthews", sport: "Hockey", rarity: "Diamond", ovr: 95, baseViews: 37000, cpm: 15, theme: "Live Series", quirks: [], color: "#00205B", number: "34", imageUrl: "https://a.espncdn.com/i/headshots/nhl/players/full/4024123.png" },
  "nhl-kucherov": { id: "nhl-kucherov", name: "Nikita Kucherov", sport: "Hockey", rarity: "Gold", ovr: 93, baseViews: 30000, cpm: 13, theme: "Live Series", quirks: [], color: "#002868", number: "86", imageUrl: "https://a.espncdn.com/i/headshots/nhl/players/full/2991285.png" },

  // === LIVE SERIES: SOCCER ===
  "soc-ronaldo": { id: "soc-ronaldo", name: "Cristiano Ronaldo", sport: "Soccer", rarity: "Mythic", ovr: 95, baseViews: 45000, cpm: 18, theme: "Live Series", quirks: ["#SHOWTIME"], color: "#E32221", number: "7", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/22774.png" },
  "soc-mbappe": { id: "soc-mbappe", name: "Kylian Mbappé", sport: "Soccer", rarity: "Diamond", ovr: 95, baseViews: 41000, cpm: 16, theme: "Live Series", quirks: [], color: "#004170", number: "9", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/229804.png" },
  "soc-bellingham": { id: "soc-bellingham", name: "Jude Bellingham", sport: "Soccer", rarity: "Gold", ovr: 93, baseViews: 34000, cpm: 14, theme: "Live Series", quirks: ["#WalkoffKO"], color: "#FEBE10", number: "5", imageUrl: "https://a.espncdn.com/i/headshots/soccer/players/full/290825.png" },

  // === LIVE SERIES: COMBAT & TENNIS ===
  "com-pereira": { id: "com-pereira", name: "Alex Pereira", sport: "Combat Sports", rarity: "Diamond", ovr: 93, baseViews: 38000, cpm: 15, theme: "Live Series", quirks: ["#WalkoffKO"], color: "#1D9354", number: "1", imageUrl: "https://a.espncdn.com/i/headshots/mma/players/full/4988771.png" },
  "ten-alcaraz": { id: "ten-alcaraz", name: "Carlos Alcaraz", sport: "Tennis", rarity: "Diamond", ovr: 94, baseViews: 35000, cpm: 14, theme: "Live Series", quirks: [], color: "#E5A278", number: "1", imageUrl: "https://a.espncdn.com/i/headshots/tennis/players/full/4363229.png" },
};

export const CARD_IDS = Object.keys(CARDS) as CardId[];

export const STAFF_ROLES: readonly StaffRole[] = ["intern", "editor", "producer"];
export const STAFF_SPECS: Record<StaffRole, { name: string; cost: number; maxRank: number }> = {
  intern: { name: "Intern", cost: 1_000, maxRank: 2 },     // No wages anymore!
  editor: { name: "Staff Editor", cost: 15_000, maxRank: 4 },
  producer: { name: "Senior Producer", cost: 100_000, maxRank: 6 },
};

interface PackSpec {
  name: string; price: number; count: number; description: string; color: string;
  odds: readonly (readonly [CardId, number])[];
}

// Built standard packs for every sport, plus Rarity upgrades
export const PACKS: Record<PackId, PackSpec> = {
  "nba-pack": { name: "NBA Live Pack", price: 2_500, count: 2, description: "Contains only Live Series Basketball cards.", color: "border-orange-500", odds: [["nba-shai", 0.50], ["nba-tatum", 0.35], ["nba-ant", 0.10], ["nba-wemby", 0.04], ["nba-luka", 0.008], ["nba-curry", 0.002]] },
  "nfl-pack": { name: "NFL Live Pack", price: 2_500, count: 2, description: "Contains only Live Series Football cards.", color: "border-blue-500", odds: [["nfl-stroud", 0.60], ["nfl-allen", 0.25], ["nfl-jefferson", 0.10], ["nfl-mccaffrey", 0.045], ["nfl-lamar", 0.005]] },
  "mlb-pack": { name: "MLB Live Pack", price: 2_500, count: 2, description: "Contains only Live Series Baseball cards.", color: "border-red-500", odds: [["mlb-holliday", 0.60], ["mlb-harper", 0.25], ["mlb-soto", 0.12], ["mlb-judge", 0.025], ["mlb-ohtani", 0.005]] },
  "nhl-pack": { name: "NHL Live Pack", price: 2_500, count: 2, description: "Contains only Live Series Hockey cards.", color: "border-cyan-500", odds: [["nhl-kucherov", 0.65], ["nhl-matthews", 0.30], ["nhl-mackinnon", 0.05]] },
  "soccer-pack": { name: "World Soccer Pack", price: 2_500, count: 2, description: "Contains only Live Series Soccer cards.", color: "border-emerald-500", odds: [["soc-bellingham", 0.65], ["soc-mbappe", 0.30], ["soc-ronaldo", 0.05]] },
  "combat-pack": { name: "Combat Sports Pack", price: 2_000, count: 1, description: "Contains only Combat Sports cards.", color: "border-red-900", odds: [["com-pereira", 1.0]] },
  "tennis-pack": { name: "Tennis Tour Pack", price: 2_000, count: 1, description: "Contains only Tennis cards.", color: "border-lime-500", odds: [["ten-alcaraz", 1.0]] },
  
  "silver-plus": { name: "Silver+ Multi-Sport", price: 10_000, count: 3, description: "Guaranteed high-level pull across all sports.", color: "border-slate-400", odds: [["nfl-stroud", 0.2], ["mlb-holliday", 0.2], ["nba-shai", 0.2], ["nhl-kucherov", 0.2], ["soc-bellingham", 0.1], ["mlb-soto", 0.05], ["nfl-jefferson", 0.04], ["nba-wemby", 0.01]] },
  "diamond-plus": { name: "Diamond+ Multi-Sport", price: 50_000, count: 2, description: "Only Diamonds and Mythics.", color: "border-cyan-300", odds: [["nba-wemby", 0.25], ["nfl-jefferson", 0.25], ["mlb-soto", 0.25], ["nhl-matthews", 0.10], ["soc-mbappe", 0.10], ["nba-luka", 0.02], ["mlb-judge", 0.02], ["mlb-ohtani", 0.01]] },
  "hero-vault": { name: "Champion Heroes Vault", price: 250_000, count: 1, description: "Guaranteed Champion Hero (2016-2026 MVPs).", color: "border-fuchsia-500", odds: [["hero-jones", 0.25], ["hero-seager", 0.25], ["hero-jokic", 0.20], ["hero-mcdavid", 0.15], ["hero-messi", 0.10], ["hero-mahomes", 0.04], ["hero-lebron", 0.01]] },
};
