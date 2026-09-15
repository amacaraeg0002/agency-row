import { useEffect, useState, useRef } from "react";
import { CARDS, CARD_IDS, PACKS, STAFF_SPECS, useGameStore, money, compact } from "./gameData";
import type { CardId, PackId, StaffRole } from "./types";
import { MonitorPlay, Settings2, Zap, Layers3, PackageOpen } from "lucide-react";

export default function App() {
  const store = useGameStore();
  const game = store.game;
  const activeCard = CARDS[game.activeCard];
  
  // Floating click numbers state
  const [clicks, setClicks] = useState<{id: number, x: number, y: number, text: string}[]>([]);
  const cookieRef = useRef<HTMLButtonElement>(null);

  // Auto-Editor Loop (Fires every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => { store.advanceAuto(); }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCookieClick = (e: React.MouseEvent) => {
    // 10% chance for perfect, 40% good, 50% flop (Simulator logic)
    const rand = Math.random();
    const grade = rand > 0.9 ? "Perfect" : rand > 0.5 ? "Good" : "Flop";
    
    store.manualClip(grade);
    
    // Add floating text
    const rect = cookieRef.current?.getBoundingClientRect();
    if (rect) {
      setClicks(prev => [...prev, { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top, text: grade }]);
      setTimeout(() => setClicks(prev => prev.slice(1)), 1000);
    }
  };

  const [modal, setModal] = useState<"binder" | "packs" | null>(null);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-[#06090e] p-4 gap-4 overflow-hidden">
      
      {/* LEFT COLUMN: THE CLICKER */}
      <div className="flex-1 panel flex flex-col items-center justify-center relative bg-gradient-to-b from-[#0f1520] to-[#080b12]">
        <h2 className="absolute top-6 left-6 font-black text-xl flex items-center gap-2"><MonitorPlay className="text-lime-400"/> AGENCY ROW</h2>
        
        <div className="text-center mb-6 mt-12">
          <p className="text-sm font-bold text-slate-400 mb-2">ACTIVE TALENT</p>
          <select className="bg-black/50 border border-white/20 rounded-lg p-2 text-white font-bold" value={game.activeCard} onChange={(e) => store.setActive(e.target.value)}>
            {CARD_IDS.filter(id => game.inventory[id]).map(id => <option key={id} value={id}>{CARDS[id].name}</option>)}
          </select>
        </div>

        {/* THE BIG COOKIE (Card) */}
        <button ref={cookieRef} onClick={handleCookieClick} className="relative transition-transform active:scale-95 group w-64 h-96 rounded-2xl border-4 border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]" style={{ backgroundColor: activeCard.color }}>
          <img src={activeCard.imageUrl} alt={activeCard.name} className="absolute bottom-0 w-full object-contain pointer-events-none drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 text-left pointer-events-none">
            <h3 className="font-black text-2xl leading-none">{activeCard.name}</h3>
            <p className="text-sm font-bold text-lime-300">{activeCard.rarity} {activeCard.ovr} OVR</p>
          </div>
          
          {/* Floating Click Animations */}
          {clicks.map(c => (
            <div key={c.id} className="animate-float font-black text-2xl text-white shadow-black drop-shadow-md" style={{ left: c.x, top: c.y }}>
              {c.text}!
            </div>
          ))}
        </button>
        
        <p className="mt-8 text-slate-400 font-bold text-sm">CLICK TO CLIP</p>
      </div>


      {/* CENTER COLUMN: STATS & LOG */}
      <div className="flex-[1.2] flex flex-col gap-4">
        {/* Top Stats */}
        <div className="panel flex flex-col items-center justify-center py-8 bg-gradient-to-r from-slate-900 to-slate-800 border-lime-400/20">
          <p className="text-slate-400 font-bold tracking-widest text-sm">AGENCY BANKROLL</p>
          <h1 className="text-5xl font-black text-lime-400 tabular-nums my-2">{money(game.cash)}</h1>
          <div className="flex gap-6 mt-2 text-sm font-bold">
            <p className="flex items-center gap-1"><Eye size={16}/> {compact(game.totalViews)} Views</p>
            <p className="flex items-center gap-1 text-fuchsia-400"><Zap size={16}/> Lvl {game.agencyLevel} ({compact(game.agencyXp)} XP)</p>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="flex gap-4">
          <button onClick={() => setModal("packs")} className="btn-green flex-1 flex justify-center items-center gap-2"><PackageOpen size={20}/> OPEN PACKS</button>
          <button onClick={() => setModal("binder")} className="btn bg-slate-800 flex-1 flex justify-center items-center gap-2"><Layers3 size={20}/> COLLECTION</button>
        </div>

        {/* Ticker Tape Log */}
        <div className="panel flex-1 overflow-hidden flex flex-col">
          <h3 className="font-bold text-sm text-slate-400 mb-4 border-b border-white/10 pb-2">LIVE ACTIVITY LOG</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {store.events.map(ev => (
              <div key={ev.id} className="flex justify-between items-center text-xs p-2 rounded bg-black/20">
                <span className={ev.isManual ? "text-white" : "text-slate-400"}>{ev.text}</span>
                <span className="font-bold text-lime-300">+{money(ev.cash)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* RIGHT COLUMN: UPGRADES & STORE */}
      <div className="flex-[0.8] panel overflow-y-auto">
        <h2 className="font-black text-xl mb-6 flex items-center gap-2">UPGRADES</h2>

        <div className="space-y-6">
          {/* Staff (Auto-Clickers) */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider border-b border-white/10 pb-1">Hire Staff (Auto-Clips)</h3>
            <p className="text-[10px] text-slate-400 mb-3">Staff work forever. No wages. Max cap based on floor size.</p>
            <div className="space-y-2">
              {(Object.keys(STAFF_SPECS) as StaffRole[]).map(role => (
                <button key={role} onClick={() => store.buyStaff(role)} disabled={game.cash < STAFF_SPECS[role].cost} className="btn flex justify-between items-center">
                  <span className="text-sm">{STAFF_SPECS[role].name}</span>
                  <span className="text-lime-300 font-bold">{money(STAFF_SPECS[role].cost)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Agency Upgrades */}
          <div>
             <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider border-b border-white/10 pb-1">Agency Expansion</h3>
             <div className="space-y-2">
                <button onClick={store.buySponsor} disabled={game.cash < 25000 * Math.pow(2, game.upgrades.sponsor)} className="btn flex justify-between items-center text-left">
                  <div>
                    <div className="text-sm">Sign Brand Sponsor</div>
                    <div className="text-[10px] text-slate-400">Current Mult: {1 + (game.upgrades.sponsor * 0.25)}x</div>
                  </div>
                  <span className="text-lime-300 font-bold">{money(25000 * Math.pow(2, game.upgrades.sponsor))}</span>
                </button>

                <button onClick={store.buyFloor} disabled={game.cash < 50000 * Math.pow(2, game.upgrades.floor)} className="btn flex justify-between items-center text-left">
                  <div>
                    <div className="text-sm">Expand Office Floor</div>
                    <div className="text-[10px] text-slate-400">Current Size: {15 + (game.upgrades.floor * 10)} sq ft</div>
                  </div>
                  <span className="text-lime-300 font-bold">{money(50000 * Math.pow(2, game.upgrades.floor))}</span>
                </button>
             </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-8">
             <button onClick={store.resetGame} className="w-full py-2 text-xs font-bold text-rose-500 border border-rose-500/20 rounded hover:bg-rose-500/10 transition">HARD RESET GAME</button>
          </div>
        </div>
      </div>

      {/* OVERLAYS (Packs & Binder) */}
      {modal === "packs" && (
        <div className="absolute inset-0 z-50 bg-black/90 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-white">THE VAULT (Buy Packs)</h2>
            <button onClick={() => setModal(null)} className="btn w-auto px-6 bg-rose-500/20 text-rose-300">CLOSE</button>
          </div>
          
          {game.pendingPack ? (
             <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-64 h-96 bg-slate-800 rounded-xl border-2 border-white/20 flex items-center justify-center cursor-pointer hover:scale-105 transition" onClick={store.revealCard}>
                  <p className="font-black text-xl animate-pulse">CLICK TO REVEAL</p>
                </div>
             </div>
          ) : (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pb-20">
               {(Object.keys(PACKS) as PackId[]).map(id => (
                 <div key={id} className="panel flex flex-col justify-between">
                   <h3 className="font-black text-lg">{PACKS[id].name}</h3>
                   <button onClick={() => store.buyPack(id)} disabled={game.cash < PACKS[id].price} className="btn-green mt-4">{money(PACKS[id].price)}</button>
                 </div>
               ))}
             </div>
          )}
        </div>
      )}

      {modal === "binder" && (
        <div className="absolute inset-0 z-50 bg-black/95 p-8 flex flex-col">
           <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-white">COLLECTION BINDER</h2>
            <button onClick={() => setModal(null)} className="btn w-auto px-6 bg-rose-500/20 text-rose-300">CLOSE</button>
          </div>
          
          <div className="flex-1 overflow-y-auto grid grid-cols-3 md:grid-cols-6 gap-4 content-start">
             {CARD_IDS.map(id => {
                const isOwned = !!game.inventory[id];
                const card = CARDS[id];
                return (
                  <div key={id} className={`aspect-[3/4] rounded-xl border ${isOwned ? 'border-lime-400/50 opacity-100' : 'border-white/10 opacity-30 grayscale'} relative overflow-hidden`} style={{ backgroundColor: isOwned ? card.color : '#000' }}>
                     {isOwned && <img src={card.imageUrl} className="absolute bottom-0 w-full object-contain pointer-events-none" />}
                     <div className="absolute bottom-2 left-2 right-2 bg-black/80 rounded p-1 text-center pointer-events-none">
                       <p className="text-[10px] font-black truncate">{card.name}</p>
                     </div>
                  </div>
                )
             })}
          </div>
        </div>
      )}

    </div>
  );
}
