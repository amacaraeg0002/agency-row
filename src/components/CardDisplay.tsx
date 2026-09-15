import type { CSSProperties } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";
import { PARALLELS } from "../cardData";
import { compact, parallelTier } from "../economy";
import type { Card, OwnedCard } from "../types";

export function CardDisplay({ card, owned }: { card: Card; owned?: OwnedCard }) {
  const tier = parallelTier(owned?.views ?? 0);
  const parallel = PARALLELS[tier];
  const style = { "--card-color": card.color } as CSSProperties;

  return (
    <article style={style} className={`card-shell ${parallel.className} relative isolate aspect-[3/4.4] w-full overflow-hidden rounded-2xl p-[3px]`}>
      <div className="relative h-full overflow-hidden rounded-[13px] bg-slate-950">
        
        {/* ESPN Player Photo injected here */}
        <div className="absolute inset-x-0 top-0 h-[79%] flex items-end justify-center">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.name} className="absolute bottom-0 w-[95%] h-[95%] object-contain object-bottom" />
          ) : (
            <div className="text-slate-700 text-6xl font-black">{card.number}</div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
        <div className="relative flex items-start justify-between p-3">
          <div className="rounded-xl border border-white/30 bg-black/55 px-3 py-1 text-center shadow-xl backdrop-blur">
            <div className="text-3xl leading-none font-black tabular-nums">{card.ovr + parallel.boost}</div>
            <div className="mt-1 text-[8px] font-bold tracking-[.2em]">OVR</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-white/25 bg-black/40 px-2 py-1 text-[9px] font-black tracking-widest uppercase">{card.rarity}</span>
            {owned?.locked && <LockKeyhole size={15} />}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="mb-1 text-[9px] font-bold tracking-[.2em] text-white/60 uppercase">{card.sport}</p>
          <h3 className="text-xl leading-tight font-black tracking-tight">{card.name}</h3>
          <div className="mt-2 flex flex-wrap gap-1">
            {card.quirks.map((quirk) => <span key={quirk} className="rounded bg-white/10 px-1.5 py-0.5 text-[8px] font-bold text-white/90">{quirk}</span>)}
          </div>
          <div className="mt-3 flex justify-between border-t border-white/15 pt-2 text-[10px] text-white/70">
            <span>{compact(card.baseViews)} VIEWS</span><span>${card.cpm.toFixed(2)} CPM</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-white/80"><Sparkles size={11} /> <span>{parallel.name}</span></div>
        </div>
        {tier > 0 && <div className="pointer-events-none absolute inset-0 animate-sheen bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
      </div>
    </article>
  );
}
