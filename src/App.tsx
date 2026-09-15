import { useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CircleDollarSign, Eye, Layers3, LayoutDashboard, MonitorPlay, PackageOpen, Radio, Settings2, TrendingUp, Zap } from "lucide-react";
import { CARDS, CARD_IDS, PARALLELS, isCardId } from "./cardData";
import { compact, money, parallelTier, sponsorCost, sponsorMultiplier, trendAt, floorCost, floorSize, levelThreshold } from "./economy";
import { useGameStore } from "./useGameStore";
import { useSession } from "./useSession";
import { Binder } from "./components/Binder";
import { CardDisplay } from "./components/CardDisplay";
import { Meter } from "./components/Meter";
import { Modal } from "./components/Modal";
import { OfficeCanvas } from "./components/OfficeCanvas";
import { PackOpening } from "./components/PackOpening";
import { StaffPanel } from "./components/StaffPanel";

type Tab = "floor" | "studio" | "vault" | "binder";
const NAV = [{ id: "floor", label: "Agency Floor", icon: LayoutDashboard }, { id: "studio", label: "The Studio", icon: MonitorPlay }, { id: "vault", label: "Pack Vault", icon: PackageOpen }, { id: "binder", label: "Binder", icon: Layers3 }] as const;

function Studio() {
  const game = useGameStore((state) => state.game);
  const assign = useGameStore((state) => state.assign);
  const active = CARDS[game.activeCard];
  const owned = game.inventory[game.activeCard]!;
  const tier = parallelTier(owned.views);

  return (
    <div>
      <p className="eyebrow">TURN TALENT INTO ATTENTION.</p><h1 className="page-title">The Studio</h1>
      <div className="mt-7 grid items-start gap-7 lg:grid-cols-[300px_1fr]">
        <div>
          <label className="mb-4 block text-xs text-slate-400">Active card
            <select value={game.activeCard} onChange={(e) => { if (isCardId(e.target.value)) assign(e.target.value, null); }} className="input mt-2">
              {CARD_IDS.filter((id) => game.inventory[id]).map((id) => <option key={id} value={id}>{CARDS[id].name}</option>)}
            </select>
          </label>
          <div className="mx-auto max-w-72"><CardDisplay card={active} owned={owned} /></div>
        </div>
        <div className="space-y-5">
          <Meter key={game.activeCard} cardId={game.activeCard} />
          <div className="grid grid-cols-3 gap-3">
            {[["Base views", compact(active.baseViews)], ["Parallel", `${PARALLELS[tier].multiplier.toFixed(2)}×`], ["Sponsor", `${sponsorMultiplier(game).toFixed(2)}×`]].map(([l, v]) => (
              <div key={l} className="panel p-4"><p className="text-xs text-slate-500">{l}</p><p className="mt-2 text-xl font-black">{v}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgencyFloor({ navigate }: { navigate: (tab: Tab) => void }) {
  const game = useGameStore((state) => state.game);
  const events = useGameStore((state) => state.events);
  const sponsorLevel = game.upgrades.sponsor;
  const flvl = game.upgrades.floor;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">INDEPENDENT AGENCY. UNLIMITED UPSIDE.</p><h1 className="page-title">Build the Empire.</h1></div>
        <button className="primary-button" onClick={() => navigate("studio")}>Make a clip <ArrowUpRight size={17} /></button>
      </div>
      <section className="panel overflow-hidden"><OfficeCanvas /></section>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="panel p-6">
          <p className="eyebrow">BRAND PARTNERSHIPS</p>
          <div className="mt-3 flex items-center justify-between"><h2 className="text-xl font-black">Sponsors</h2><TrendingUp size={24} className="text-lime-300" /></div>
          <p className="mt-3 text-sm text-slate-400">Multiplier: {(1 + sponsorLevel * 0.25).toFixed(2)}×.</p>
          <button className="secondary-button mt-5 w-full justify-between" onClick={useGameStore((s) => s.upgradeSponsor)} disabled={game.cash < sponsorCost(sponsorLevel)}><span>Sign deal</span><span>{money(sponsorCost(sponsorLevel))}</span></button>
        </section>
        <section className="panel p-6">
          <p className="eyebrow">AGENCY EXPANSION</p>
          <div className="mt-3 flex items-center justify-between"><h2 className="text-xl font-black">Expand Floor</h2><Layers3 size={24} className="text-blue-300" /></div>
          <p className="mt-3 text-sm text-slate-400">Size: {floorSize(flvl)}x{floorSize(flvl)} ft.</p>
          <button className="secondary-button mt-5 w-full justify-between" onClick={useGameStore((s) => s.upgradeFloor)} disabled={game.cash < floorCost(flvl)}><span>Add +10 sq ft</span><span>{money(floorCost(flvl))}</span></button>
        </section>
        <section className="panel p-6">
          <p className="eyebrow">LIVE ACTIVITY</p><h2 className="mt-3 text-xl font-black">Recent Clips</h2>
          <div className="mt-4 space-y-3">
            {events.slice(-3).reverse().map((e) => (
              <div key={e.id} className="flex justify-between border-b border-white/5 pb-2 text-xs">
                <div><p className="text-slate-300">{e.text}</p><p className="text-slate-500">+{compact(e.views)} views</p></div><span className="font-bold text-lime-200">{money(e.cash)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <StaffPanel />
    </div>
  );
}

export default function App() {
  const { ready } = useSession();
  const [tab, setTab] = useState<Tab>("floor");
  const [settings, setSettings] = useState(false);
  const game = useGameStore((state) => state.game);
  const message = useGameStore((state) => state.message);
  
  if (!ready) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-dvh lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/8 bg-[#0b1018] p-6 lg:flex">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-slate-950"><BriefcaseBusiness size={23} /></div><div><p className="text-sm font-black">AGENCY ROW</p><p className="mt-1 text-[9px] text-slate-500 tracking-[.22em]">TYCOON</p></div></div>
        <nav className="mt-12 space-y-2">{NAV.map(({ id, label, icon: Icon }) => (<button key={id} onClick={() => setTab(id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm ${tab === id ? "bg-lime-300/10 font-bold text-lime-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={18} /> {label}</button>))}</nav>
        <button className="secondary-button mt-auto justify-center" onClick={() => setSettings(true)}><Settings2 size={16} /> Settings</button>
      </aside>
      
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#090d14]/95 backdrop-blur-xl px-5 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-xs font-bold text-lime-100">
          <span className="flex items-center gap-2"><Radio size={16} className="text-lime-300" /> #{trendAt(game.clockMs).sport.replace(" ", "")}Season</span>
          <span className="flex items-center gap-2 text-fuchsia-300 bg-fuchsia-950 px-2 py-1 rounded"><Zap size={14} /> LVL {game.agencyLevel} · {compact(game.agencyXp)} / {compact(levelThreshold(game.agencyLevel))} XP</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><Eye size={17} className="text-slate-500" /><span className="text-sm font-bold tabular-nums">{compact(game.totalViews)}</span></div>
          <div className="flex items-center gap-2"><CircleDollarSign size={18} className="text-lime-300" /><span className="text-sm font-black tabular-nums">{money(game.cash)}</span></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-7">
        {tab === "floor" && <AgencyFloor navigate={setTab} />}
        {tab === "studio" && <Studio />}
        {tab === "vault" && <PackOpening />}
        {tab === "binder" && <Binder />}
        <div className="mt-8 border-t border-white/8 pt-5 text-xs text-slate-400"><p>{message}</p></div>
      </main>

      {settings && (<Modal title="Settings" onClose={() => setSettings(false)}><button className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white w-full" onClick={() => { useGameStore.getState().reset(); setSettings(false); }}>Reset Game</button></Modal>)}
    </div>
  );
}
