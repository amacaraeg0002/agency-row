import { useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CircleDollarSign, Eye, Layers3, LayoutDashboard, MonitorPlay, PackageOpen, Radio, Settings2, Sparkles, TrendingUp } from "lucide-react";
import { CARDS, CARD_IDS, PARALLELS, isCardId } from "./cardData";
import { canAssign, compact, money, parallelTier, sponsorCost, sponsorMultiplier, trendAt } from "./economy";
import { getStorageIssue } from "./persistence";
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

const NAV = [
  { id: "floor", label: "Agency Floor", icon: LayoutDashboard },
  { id: "studio", label: "The Studio", icon: MonitorPlay },
  { id: "vault", label: "Pack Ripping Vault", icon: PackageOpen },
  { id: "binder", label: "Collection Binder", icon: Layers3 },
] as const;

function Studio() {
  const game = useGameStore((state) => state.game);
  const assign = useGameStore((state) => state.assign);
  const active = CARDS[game.activeCard];
  const owned = game.inventory[game.activeCard]!;
  const tier = parallelTier(owned.views);

  return (
    <div>
      <p className="eyebrow">TURN TALENT INTO ATTENTION.</p>
      <h1 className="page-title">The Studio</h1>
      <div className="mt-7 grid items-start gap-7 lg:grid-cols-[300px_1fr]">
        <div>
          <label className="mb-4 block text-xs text-slate-400">
            Active card
            <select value={game.activeCard} onChange={(e) => { if (isCardId(e.target.value)) assign(e.target.value, null); }} className="input mt-2">
              {CARD_IDS.filter((id) => canAssign(game, id, null)).map((id) => <option key={id} value={id}>{CARDS[id].name}</option>)}
            </select>
          </label>
          <div className="mx-auto max-w-72">
            <CardDisplay card={active} owned={owned} />
          </div>
        </div>
        <div className="space-y-5">
          <Meter key={game.activeCard} cardId={game.activeCard} />
          <div className="grid grid-cols-3 gap-3">
            {[["Base views", compact(active.baseViews)], ["Parallel", `${PARALLELS[tier].multiplier.toFixed(2)}×`], ["Sponsor", `${sponsorMultiplier(game).toFixed(2)}×`]].map(([label, value]) => (
              <div key={label} className="panel p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-xl font-black">{value}</p></div>
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
  const upgrade = useGameStore((state) => state.upgrade);
  const sponsorLevel = game.upgrades.sponsor;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">INDEPENDENT AGENCY. UNLIMITED UPSIDE.</p>
          <h1 className="page-title">Big moments. Small beginnings.</h1>
        </div>
        <button className="primary-button" onClick={() => navigate("studio")}>Make a clip <ArrowUpRight size={17} /></button>
      </div>
      <section className="panel overflow-hidden">
        <OfficeCanvas />
      </section>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <section className="panel p-6">
          <p className="eyebrow">BRAND PARTNERSHIPS</p>
          <div className="mt-3 flex items-center justify-between"><h2 className="text-xl font-black">Make attention pay.</h2><TrendingUp size={24} className="text-lime-300" /></div>
          <p className="mt-3 text-sm text-slate-400">Current multiplier: {sponsorMultiplier(game).toFixed(2)}×.</p>
          <button className="secondary-button mt-5 w-full justify-between" onClick={upgrade} disabled={sponsorLevel >= 8 || game.cash < sponsorCost(sponsorLevel)}>
            <span>{sponsorLevel >= 8 ? "All deals signed" : "Sign sponsor · +0.25×"}</span>
            <span>{sponsorLevel >= 8 ? "MAX" : money(sponsorCost(sponsorLevel))}</span>
          </button>
        </section>
        <section className="panel p-6">
          <p className="eyebrow">LIVE FROM THE CUTTING ROOM</p>
          <h2 className="mt-3 text-xl font-black">Agency activity</h2>
          <div className="mt-4 space-y-3">
            {events.length === 0 ? <p className="text-sm text-slate-500">Your first headline is waiting.</p> : events.slice(-4).reverse().map((e) => (
              <div key={e.id} className="flex justify-between border-b border-white/5 pb-3 text-xs">
                <div><p className="text-slate-300">{e.text}</p><p className="mt-1 text-slate-500">+{compact(e.views)} views</p></div>
                <span className={`font-bold ${e.cash < 0 ? "text-rose-300" : "text-lime-200"}`}>{money(e.cash)}</span>
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
  const { ready, error } = useSession();
  const [tab, setTab] = useState<Tab>("floor");
  const [settings, setSettings] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const game = useGameStore((state) => state.game);
  const message = useGameStore((state) => state.message);
  const reset = useGameStore((state) => state.reset);
  const trend = trendAt(game.clockMs);
  const storageIssue = getStorageIssue();

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-8">
        <div className="panel max-w-md p-8 text-center">
          <BriefcaseBusiness className="mx-auto text-lime-300" size={38} />
          <h1 className="mt-5 text-2xl font-black">Card Agency Tycoon</h1>
          <p className="mt-4 text-sm text-slate-400">{error || "Loading..."}</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/8 bg-[#0b1018] p-6 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-slate-950"><BriefcaseBusiness size={23} /></div>
          <div><p className="text-sm font-black">AGENCY ROW</p><p className="mt-1 text-[9px] text-slate-500 tracking-[.22em]">TYCOON</p></div>
        </div>
        <nav className="mt-12 space-y-2">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm ${tab === id ? "bg-lime-300/10 font-bold text-lime-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <button className="secondary-button mt-auto justify-center" onClick={() => setSettings(true)}><Settings2 size={16} /> Settings</button>
      </aside>
      
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#090d14]/95 backdrop-blur-xl px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-bold text-lime-100">
          <Radio size={16} className="text-lime-300" /> #{trend.sport.replace(" ", "")}Season
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><Eye size={17} className="text-slate-500" /><span className="text-sm font-bold tabular-nums">{compact(game.totalViews)}</span></div>
          <div className="flex items-center gap-2"><CircleDollarSign size={18} className="text-lime-300" /><span className="text-sm font-black tabular-nums">{money(game.cash)}</span></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-7">
        {storageIssue && <div className="mb-6 rounded-xl bg-amber-400/10 p-4 text-sm text-amber-200">{storageIssue}</div>}
        {tab === "floor" && <AgencyFloor navigate={setTab} />}
        {tab === "studio" && <Studio />}
        {tab === "vault" && <PackOpening />}
        {tab === "binder" && <Binder />}
        <div className="mt-8 border-t border-white/8 pt-5 text-xs text-slate-400"><p>{message}</p></div>
      </main>

      {settings && (
        <Modal title="Settings" onClose={() => { setSettings(false); setConfirmReset(false); }}>
          <div className="rounded-xl border border-rose-400/20 p-5 mt-5">
            <h3 className="font-bold text-slate-100">Reset save</h3>
            {!confirmReset ? (
              <button className="secondary-button mt-4" onClick={() => setConfirmReset(true)}>Start a new agency</button>
            ) : (
              <div className="mt-4 flex gap-3">
                <button className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white" onClick={() => { reset(); setSettings(false); setTab("floor"); }}>Confirm reset</button>
                <button className="secondary-button" onClick={() => setConfirmReset(false)}>Cancel</button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
<section className="panel p-6">
          <p className="eyebrow">AGENCY EXPANSION</p>
          <div className="mt-3 flex items-center justify-between"><h2 className="text-xl font-black">Expand Floor.</h2><Layers3 size={24} className="text-lime-300" /></div>
          <p className="mt-3 text-sm text-slate-400">Current Size: {floorSize(game.upgrades.floor)}x{floorSize(game.upgrades.floor)} ft.</p>
          <button className="secondary-button mt-5 w-full justify-between" onClick={useGameStore((s) => s.upgradeFloor)} disabled={game.cash < floorCost(game.upgrades.floor)}>
            <span>Add +10 sq ft</span>
            <span>{money(floorCost(game.upgrades.floor))}</span>
          </button>
        </section>
LVL {game.agencyLevel} | XP: {compact(game.agencyXp)} / {compact(levelThreshold(game.agencyLevel))}
