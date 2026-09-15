import { useEffect, useState } from "react";
import { SAVE_KEY } from "./economy";
import { recordStorageIssue } from "./persistence";
import { useGameStore } from "./useGameStore";

export function useSession(): { ready: boolean; error: string } {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false; let release: (() => void) | undefined;
    const controller = new AbortController();
    if (!navigator.locks) { setError("Web Locks required."); return; }
    
    void navigator.locks.request(SAVE_KEY, { signal: controller.signal }, async () => {
      if (disposed) return;
      await useGameStore.persist.rehydrate();
      if (disposed) return;
      setReady(true);
      await new Promise<void>((resolve) => { release = resolve; if (disposed) resolve(); });
    }).catch((reason: unknown) => {
      if (disposed) return;
      const message = reason instanceof Error ? reason.message : "Could not acquire save.";
      setError(message); recordStorageIssue(message);
    });
    
    return () => { disposed = true; controller.abort(); release?.(); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let frame = 0; let previous = performance.now(); let accumulated = 0;
    const update = (now: number) => {
      const elapsed = Math.min(250, Math.max(0, now - previous)); previous = now;
      if (document.hidden) { accumulated = 0; } else {
        accumulated += elapsed;
        if (accumulated >= 1_000) { accumulated -= 1_000; useGameStore.getState().advance(); }
      }
      frame = requestAnimationFrame(update);
    };
    const visibility = () => { previous = performance.now(); accumulated = 0; };
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", visibility); };
  }, [ready]);

  return { ready, error };
}
