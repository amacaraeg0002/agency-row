import { useState } from "react"; import { Search } from "lucide-react"; import { CARDS, CARD_IDS } from "../cardData"; import { SPORTS, CardId, Theme } from "../types"; import { useGameStore } from "../useGameStore"; import { CardDisplay } from "./CardDisplay"; import { Modal } from "./Modal";
export function Binder() {
  const game = useGameStore((state) => state.game); const claimReward = useGameStore((state) => state.claimCollectionReward); const [search, setSearch] = useState(""); const [sport, setSport] = useState("All sports"); const [theme, setTheme] = useState<Theme>("Live Series"); const [selected, setSelected] = useState<CardId | null>(null);
  const themeIds = CARD_IDS.filter(id => CARDS[id].theme === theme && id !== "hero-brady");
  const collectedTheme = themeIds.filter(id => Boolean(game.inventory[id]));
  const displayIds = themeIds.filter((id) => Boolean(game.inventory[id]) && (sport === "All sports" || CARDS[id].sport === sport) && CARDS[id].name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between items-end">
        <div><p className="eyebrow">EVERY CARD HAS A STORY.</p><h1 className="page-title">Collection Binder</h1></div>
        <div className="text-right"><p className="text-xs text-slate-400">{theme} Progress</p><p className="text-2xl font-black text-lime-300">{collectedTheme.length} / {themeIds.length}</p></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <select className="input sm:w-48" value={theme} onChange={(e) => setTheme(e.target.value as Theme)}><option value="Live Series">Live Series</option><option value="Champion Heroes">Champion Heroes</option></select>
        <select className="input sm:w-48" value={sport} onChange={(e) => setSport(e.target.value)}><option>All sports</option>{SPORTS.map((s) => <option key={s}>{s}</option>)}</select>
        <label className="relative flex-1 min-w-[200px]"><Search size={17} className="absolute top-3.5 left-4 text-slate-500" /><input className="input pl-11" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." /></label>
      </div>
      {theme === "Champion Heroes" && collectedTheme.length === themeIds.length && !game.inventory["hero-brady"] && (<button onClick={claimReward} className="primary-button mt-6 w-full justify-center py-4 bg-fuchsia-500 text-white">CLAIM 100 OVR TOM BRADY REWARD</button>)}
      {theme === "Champion Heroes" && game.inventory["hero-brady"] && (<div className="mt-6"><h3 className="font-black text-fuchsia-400 mb-4">REWARD UNLOCKED</h3><div className="w-64"><CardDisplay card={CARDS["hero-brady"]} owned={game.inventory["hero-brady"]} /></div></div>)}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {displayIds.map((id) => (<button key={id} className="text-left transition-transform hover:-translate-y-1" onClick={() => setSelected(id)}><CardDisplay card={CARDS[id]} owned={game.inventory[id]} /><div className="mt-3 text-xs text-slate-400">×{game.inventory[id]!.count} owned</div></button>))}
      </div>
      {selected && (<Modal title="Card dossier" onClose={() => setSelected(null)}><div className="mx-auto w-64 mt-4"><CardDisplay card={CARDS[selected]} owned={game.inventory[selected]} /></div></Modal>)}
    </div>
  );
}
