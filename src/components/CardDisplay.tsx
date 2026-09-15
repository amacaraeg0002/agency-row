import type { CSSProperties } from "react"; import { LockKeyhole, Sparkles } from "lucide-react"; import { PARALLELS } from "../cardData"; import { compact, parallelTier } from "../economy"; import type { Card, OwnedCard } from "../types";
export function CardDisplay({ card, owned }: { card: Card; owned?: OwnedCard }) {
  const tier = parallelTier(owned?.views ?? 0); const parallel = PARALLELS[tier]; const style = { "--card-color": card.color } as CSSProperties;
  return (
    <article style={style} className={`card-shell ${parallel.className} relative isolate aspect-[3/4.4] w-full overflow-hidden rounded-2xl p-[3px] shadow-2xl transition-transform`}>
      <div className="relative h-full overflow-hidden rounded-[13px] bg-slate-950">
        <div className="absolute inset-x-0 bottom-[20%] top-0 flex items-end justify-center"><img src={card.imageUrl} alt={card.name} className="h-[100%] w-[100%] object-contain object-bottom drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />
        <div className="relative flex items-start justify-between p-3">
          <div className="rounded-xl border border-white/30 bg-black/55 px-3 py-1 text-center shadow-xl backdrop-blur-md"><div className="text-3xl leading-none font-black tabular-nums text-white">{card.ovr + parallel.boost}</div><div className="mt-1 text-[8px] font-bold tracking-[.2em] text-white/80">OVR</div></div>
          <div className="flex flex-col items-end gap-2"><span className="rounded-full border border-white/25 bg-black/60 px-2 py-1 text-[9px] font-black tracking-widest uppercase text-white shadow-lg backdrop-blur-md">{card.rarity}</span>{owned?.locked && <LockKeyhole size={15} className="text-white" />}</div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="mb-1 text-[9px] font-bold tracking-[.2em] text-white/60 uppercase">{card.sport}</p><h3 className="text-xl leading-tight font-black tracking-tight text-white">{card.name}</h3>
          <div className="mt-2 flex flex-wrap gap-1">{card.quirks.map((q) => <span key={q} className="rounded bg-white/20 px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm backdrop-blur">{q}</span>)}</div>
          <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2 text-[10px] text-white/80"><span>{compact(card.baseViews)} VIEWS</span><span>${card.cpm.toFixed(2)} CPM</span></div>
          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-lime-300"><Sparkles size={11} /> <span>{parallel.name}</span></div>
        </div>
        {tier > 0 && <div className="pointer-events-none absolute inset-0 animate-sheen bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay" />}
      </div>
    </article>
  );
}
