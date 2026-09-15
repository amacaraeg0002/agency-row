import { Pause, Play, UserPlus } from "lucide-react";
import { CARDS, CARD_IDS, RARITIES, STAFF_ROLES, STAFF_SPECS, isCardId } from "../cardData";
import { calculateYield, canAssign, compact, money, trendAt } from "../economy";
import { useGameStore } from "../useGameStore";

export function StaffPanel() {
  const game = useGameStore((state) => state.game);
  const hire = useGameStore((state) => state.hire);
  const assign = useGameStore((state) => state.assign);
  const pause = useGameStore((state) => state.pause);

  return (
    <section className="space-y-5">
      <div className="flex justify-between items-end">
        <div><p className="eyebrow">BUILD YOUR TEAM</p><h2 className="mt-2 text-xl font-black">The people behind the clips.</h2></div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {STAFF_ROLES.map((role) => {
          const spec = STAFF_SPECS[role];
          return (
            <div key={role} className="panel p-5">
              <UserPlus size={21} className="mb-4 text-lime-200" />
              <h3 className="font-bold">{spec.name}</h3>
              <p className="mt-2 text-xs text-slate-400">{money(spec.wage)} wage / 1k views</p>
              <button className="secondary-button mt-5 w-full justify-between" disabled={game.staff.length >= 4 || game.cash < spec.cost} onClick={() => hire(role)}>
                Hire <span>{money(spec.cost)}</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {game.staff.map((staff, index) => {
          const card = staff.cardId ? CARDS[staff.cardId] : null;
          const owned = staff.cardId ? game.inventory[staff.cardId] : null;
          return (
            <div key={staff.id} className="panel p-5">
              <div className="flex justify-between">
                <h3 className="font-bold">Desk {index + 1} · {STAFF_SPECS[staff.role].name}</h3>
                <span className={`badge ${staff.paused ? "text-slate-400" : "text-lime-200"}`}>{staff.paused ? "Paused" : "Editing"}</span>
              </div>
              <select className="input mt-4" value={staff.cardId ?? ""} onChange={(e) => { if (e.target.value) assign(e.target.value as any, staff.id); else assign(null, staff.id); }}>
                <option value="">No card assigned</option>
                {CARD_IDS.filter((id) => Boolean(game.inventory[id]) && (staff.cardId === id || canAssign(game, id, staff.id))).map((id) => (
                  <option key={id} value={id}>{CARDS[id].name}</option>
                ))}
              </select>
              <button disabled={!staff.cardId} onClick={() => pause(staff.id)} className="secondary-button mt-4 w-full justify-center">
                {staff.paused ? <Play size={15} /> : <Pause size={15} />} {staff.paused ? "Resume desk" : "Pause desk"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
