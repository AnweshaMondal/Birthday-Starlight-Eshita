"use client";

import { useEffect, useRef } from "react";

type Heart = { x: number; y: number; size: number; speed: number; drift: number; alpha: number };

export default function FloatingHearts() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, raf = 0;
    const pointer = { x: -999, y: -999 };
    const hearts: Heart[] = Array.from({ length: 22 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      size: 5 + Math.random() * 10, speed: .18 + Math.random() * .35,
      drift: Math.random() * 6, alpha: .08 + Math.random() * .18,
    }));
    const resize = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
    const move = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; };
    resize();
    const drawHeart = (x: number, y: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + s * .3);
      ctx.bezierCurveTo(x - s, y - s * .3, x - s * .45, y - s, x, y - s * .4);
      ctx.bezierCurveTo(x + s * .45, y - s, x + s, y - s * .3, x, y + s * .3);
      ctx.fill();
    };
    const loop = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      hearts.forEach((p) => {
        p.y -= p.speed;
        p.x += Math.sin(time * .001 + p.drift) * .08;
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d = Math.hypot(dx, dy);
        if (d < 90 && d > 0) { p.x += dx / d * 2.2; p.y += dy / d * 2.2; }
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        ctx.fillStyle = `rgba(247, 178, 205, ${p.alpha})`;
        drawHeart(p.x, p.y, p.size);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener("resize", resize, { passive: true });
    addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} className="floating-hearts" aria-hidden="true" />;
}
