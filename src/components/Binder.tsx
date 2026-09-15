import { useState } from "react";
import { Search } from "lucide-react";
import { CARDS, CARD_IDS } from "../cardData";
import { SPORTS, CardId } from "../types";
import { useGameStore } from "../useGameStore";
import { CardDisplay } from "./CardDisplay";
import { Modal } from "./Modal";

export function Binder() {
  const game = useGameStore((state) => state.game);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("All sports");
  const [selected, setSelected] = useState<CardId | null>(null);

  const ids = CARD_IDS.filter((id) => Boolean(game.inventory[id]) && (sport === "All sports" || CARDS[id].sport === sport) && CARDS[id].name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <p className="eyebrow">EVERY CARD HAS A STORY.</p>
      <h1 className="page-title">Collection Binder & Slabs</h1>
      <div className="mt-6 flex gap-3">
        <label className="relative flex-1"><Search size={17} className="absolute top-3.5 left-4 text-slate-500" /><input className="input pl-11" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." /></label>
        <select className="input sm:w-52" value={sport} onChange={(e) => setSport(e.target.value)}><option>All sports</option>{SPORTS.map((s) => <option key={s}>{s}</option>)}</select>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {ids.map((id) => (
          <button key={id} className="text-left transition-transform hover:-translate-y-1" onClick={() => setSelected(id)}>
            <CardDisplay card={CARDS[id]} owned={game.inventory[id]} />
            <div className="mt-3 text-xs text-slate-400">×{game.inventory[id]!.count} owned</div>
          </button>
        ))}
      </div>

      {selected && (
        <Modal title="Card dossier" onClose={() => setSelected(null)}>
          <div className="mx-auto w-64 mt-4"><CardDisplay card={CARDS[selected]} owned={game.inventory[selected]} /></div>
        </Modal>
      )}
    </div>
  );
}
