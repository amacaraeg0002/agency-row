import { useEffect, useRef } from "react";
import { CARDS } from "../cardData";
import { compact, money } from "../economy";
import { useGameStore } from "../useGameStore";

const WIDTH = 1_100;
const HEIGHT = 700;
const DESKS = [[4, 5], [3, 10], [7, 10], [10, 7], [10, 3]] as const;

export function OfficeCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx) return;
    
    let frame = 0;
    const resize = () => {
      const box = element.getBoundingClientRect();
      element.width = box.width * 2; element.height = box.height * 2;
    };
    new ResizeObserver(resize).observe(element); resize();

    const point = (x: number, y: number, z = 0): [number, number] => [WIDTH / 2 + (x - y) * 29, 150 + (x + y) * 15 - z];
    const polygon = (pts: [number, number][], fill: string) => {
      ctx.beginPath(); pts.forEach((p, i) => i === 0 ? ctx.moveTo(...p) : ctx.lineTo(...p));
      ctx.fillStyle = fill; ctx.fill();
    };

    const draw = (now: number) => {
      ctx.setTransform(element.width / WIDTH, 0, 0, element.height / HEIGHT, 0, 0);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#0c121c"; ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
          polygon([point(x, y), point(x + 1, y), point(x + 1, y + 1), point(x, y + 1)], (x + y) % 2 === 0 ? "#26303c" : "#293440");
        }
      }

      const state = useGameStore.getState();
      DESKS.forEach(([x, y], i) => {
        const staff = i === 0 ? null : state.game.staff[i - 1];
        if (i > 0 && !staff) return;
        polygon([point(x, y), point(x + 2, y), point(x + 2, y + 1.5), point(x, y + 1.5)], i === 0 ? "#56645d" : "#485566");
      });

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvas} className="block aspect-[11/7] w-full rounded-2xl" />;
}
