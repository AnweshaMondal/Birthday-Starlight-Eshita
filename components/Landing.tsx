"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import AmbientCanvas from "./effects/AmbientCanvas";

export default function Landing({ greeting, recipientLine }: { greeting: string; recipientLine: string }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".moon-glow", { opacity: 1, duration: 2 })
        .to(".hero-kicker", { opacity: 1, y: 0, duration: 1.2 }, 1.7)
        .to(".hero-title", { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6 }, 2.2)
        .to(".hero-subtitle", { opacity: 1, y: 0, duration: 1 }, 3.2)
        .to(".particle-heart", { opacity: 1, scale: 1, duration: 1.5, ease: "back.out(1.8)" }, 3.5)
        .to(".open-button", { opacity: 1, y: 0, duration: 1 }, 4.4);
    }, root);
    return () => ctx.revert();
  }, []);

  const dots = Array.from({ length: 90 }, (_, i) => {
    const a = Math.PI * 2 * i / 90;
    const x = (16 * Math.pow(Math.sin(a), 3) * 3.05).toFixed(4);
    const y = (-(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * 3.05).toFixed(4);
    return <i key={i} style={{ "--x": `${x}px`, "--y": `${y}px`, "--d": `${(i % 12) * .08}s` } as React.CSSProperties} />;
  });

  return (
    <section className="hero" ref={root} id="home">
      <AmbientCanvas />
      <div className="moon-glow" />
      <div className="hero-copy">
        <span className="hero-kicker">a little universe, just for you</span>
        <h1 className="hero-title">{greeting}</h1>
        <p className="hero-subtitle">{recipientLine}</p>
        <div className="particle-heart" aria-hidden="true">{dots}</div>
        <button className="open-button" onClick={() => document.querySelector("#countdown")?.scrollIntoView({ behavior: "smooth" })}>
          Open Your Surprise <ChevronDown size={18} />
        </button>
      </div>
      <div className="scroll-whisper">made of memories & stardust</div>
    </section>
  );
}
