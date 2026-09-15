import { useEffect, useState } from "react";
import { useGameStore } from "./useGameStore";
export function useSession(): { ready: boolean; error: string } {
  const [ready, setReady] = useState(false);
  useEffect(() => { useGameStore.persist.rehydrate().then(() => setReady(true)); }, []);
  useEffect(() => {
    if (!ready) return;
    let frame = 0; let previous = performance.now(); let accumulated = 0;
    const update = (now: number) => {
      const elapsed = Math.min(250, Math.max(0, now - previous)); previous = now;
      if (!document.hidden) { accumulated += elapsed; if (accumulated >= 1_000) { accumulated -= 1_000; useGameStore.getState().advance(); } }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update); return () => cancelAnimationFrame(frame);
  }, [ready]);
  return { ready, error: "" };
}
