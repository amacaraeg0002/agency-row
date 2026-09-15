import { useCallback, useEffect, useRef, useState } from "react";
import { Scissors, Target } from "lucide-react";
import { CARDS } from "../cardData";
import { compact, cycleDuration, money, triangle } from "../economy";
import { useGameStore } from "../useGameStore";
import type { CardId, Yield } from "../types";

export function Meter({ cardId }: { cardId: CardId }) {
  const needle = useRef<HTMLDivElement>(null);
  const origin = useRef(performance.now());
  const frozenUntil = useRef(0);
  const frozenPosition = useRef(1);
  const [result, setResult] = useState<Yield | null>(null);
  const [frozen, setFrozen] = useState(false);
  const cycle = cycleDuration(CARDS[cardId]);

  const release = useCallback(() => {
    const now = performance.now();
    if (now < frozenUntil.current || document.hidden) return;
    const x = triangle((now - origin.current) / 1_000, cycle);
    const produced = useGameStore.getState().manual(x);
    if (!produced) return;
    frozenPosition.current = x; frozenUntil.current = now + 900;
    setFrozen(true); setResult(produced);
    if (needle.current) needle.current.style.left = `${x * 100}%`;
  }, [cycle]);

  useEffect(() => {
    let frame = 0;
    const draw = (now: number) => {
      let x: number;
      if (frozenUntil.current > now) { x = frozenPosition.current; } else {
        if (frozenUntil.current !== 0) { frozenUntil.current = 0; origin.current = now; setFrozen(false); }
        x = triangle((now - origin.current) / 1_000, cycle);
      }
      if (needle.current) needle.current.style.left = `${x * 100}%`;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [cycle]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (document.querySelector("dialog[open]")) return;
      if ((e.target as HTMLElement)?.closest("button, input")) return;
      e.preventDefault(); release();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [release]);

  return (
    <section className="panel p-6 sm:p-9">
      <div className="flex justify-between gap-3">
        <div><p className="eyebrow">ONE CUT. MAKE IT COUNT.</p><h2 className="mt-2 text-2xl font-black">Find the moment.</h2></div>
        <Target className="text-lime-300" size={29} />
      </div>
      <div className="relative mt-12 mb-8">
        <div className="relative h-12 overflow-hidden rounded-xl border border-white/15 bg-rose-950">
          <div className="absolute inset-y-0 left-[40%] w-[20%] bg-amber-400" />
          <div className="absolute inset-y-0 left-[46.5%] w-[7%] bg-lime-400" />
        </div>
        <div ref={needle} className="pointer-events-none absolute -top-3 bottom-[-12px] left-full w-1 -translate-x-1/2 bg-white shadow-[0_0_18px_#ffffff]" />
      </div>
      <button onClick={release} disabled={frozen} className="primary-button mt-8 w-full justify-center py-4">
        <Scissors size={19} /> {frozen ? "Rendering..." : "Release clip (SPACE)"}
      </button>
      <div className="mt-5 min-h-20 text-center">
        {result && (
          <div className="animate-reveal">
            <p className={`text-lg font-black ${result.grade === "Perfect" ? "text-lime-300" : "text-amber-200"}`}>{result.grade.toUpperCase()} RELEASE</p>
            <p className="mt-1 text-sm text-slate-300">+{compact(result.views)} views / {money(result.net)}</p>
          </div>
        )}
      </div>
    </section>
  );
}
