import { useEffect, useRef } from "react"; import { CARDS } from "../cardData"; import { compact, money, floorSize } from "../economy"; import { useGameStore } from "../useGameStore";
const WIDTH = 1100; const HEIGHT = 700; const DESKS = [[4, 5], [3, 10], [7, 10], [10, 7], [10, 3], [14, 5], [14, 10], [5, 14], [10, 14], [14, 14]] as const;
export function OfficeCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current; const ctx = element?.getContext("2d"); if (!element || !ctx) return;
    let frame = 0; const resize = () => { const box = element.getBoundingClientRect(); element.width = box.width * 2; element.height = box.height * 2; }; new ResizeObserver(resize).observe(element); resize();
    const draw = (now: number) => {
      ctx.setTransform(element.width / WIDTH, 0, 0, element.height / HEIGHT, 0, 0); ctx.clearRect(0, 0, WIDTH, HEIGHT);
      const state = useGameStore.getState(); const GRID = floorSize(state.game.upgrades.floor);
      const point = (x: number, y: number, z = 0): [number, number] => [WIDTH / 2 + (x - y) * (400/GRID), 100 + (x + y) * (200/GRID) - z];
      const polygon = (pts: [number, number][], fill: string, stroke?: string, glow?: string) => { ctx.beginPath(); pts.forEach((p, i) => i === 0 ? ctx.moveTo(...p) : ctx.lineTo(...p)); ctx.closePath(); if(glow){ctx.shadowBlur=20; ctx.shadowColor=glow;} ctx.fillStyle = fill; ctx.fill(); ctx.shadowBlur=0; if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); } };
      const bg = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, 0, WIDTH/2, HEIGHT/2, WIDTH * 0.8); bg.addColorStop(0, "#0b121d"); bg.addColorStop(1, "#04070a"); ctx.fillStyle = bg; ctx.fillRect(0, 0, WIDTH, HEIGHT);
      for (let x = 0; x < GRID; x++) { for (let y = 0; y < GRID; y++) { polygon([point(x, y), point(x + 1, y), point(x + 1, y + 1), point(x, y + 1)], (x + y) % 2 === 0 ? "#0d141f" : "#111926", "#1e293b"); } }
      DESKS.forEach(([x, y], i) => {
        if (x >= GRID || y >= GRID) return; const staff = i === 0 ? null : state.game.staff[i - 1]; if (i > 0 && !staff) return;
        const active = i === 0 || (staff?.cardId && !staff.paused); const color = active ? (i === 0 ? "#bef264" : CARDS[staff!.cardId!]?.color || "#38bdf8") : "#334155"; const h = 15;
        polygon([point(x, y), point(x + 2, y), point(x + 2, y + 1.5), point(x, y + 1.5)], "rgba(15, 23, 42, 0.9)", color, active ? color : undefined);
        polygon([point(x, y, h), point(x + 2, y, h), point(x + 2, y + 1.5, h), point(x, y + 1.5, h)], "#1e293b", color);
      });
      state.events.forEach((ev) => {
        const age = now - ev.at; if (age < 0 || age > 2000) return; const dIdx = ev.deskId === null ? 0 : state.game.staff.findIndex((s) => s.id === ev.deskId) + 1;
        if (dIdx < 0 || dIdx >= DESKS.length) return; const [x, y] = DESKS[dIdx]; const p = point(x + 1, y + 0.5, 50 + age / 15);
        ctx.globalAlpha = 1 - Math.pow(age / 2000, 2); ctx.font = "800 14px system-ui"; ctx.textAlign = "center"; ctx.fillStyle = "#bef264"; ctx.fillText(`+${compact(ev.views)}`, p[0], p[1]); ctx.fillStyle = ev.cash >= 0 ? "#86efac" : "#fda4af"; ctx.font = "600 12px system-ui"; ctx.fillText(`${ev.cash >= 0 ? "+" : ""}${money(ev.cash)}`, p[0], p[1] + 16); ctx.globalAlpha = 1;
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw); return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvas} className="block aspect-[11/7] w-full rounded-2xl bg-[#04070a] shadow-inner" />;
}
