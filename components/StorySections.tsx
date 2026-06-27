"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Sparkles, X } from "lucide-react";
import type { BirthdayModel, Photo } from "@/models/birthday";

function daysAlive(date: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(`${date}T00:00:00`).getTime()) / 86400000));
}

export function Countdown({ birthdayDate }: { birthdayDate: string }) {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const target = daysAlive(birthdayDate);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1800);
      setDays(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [birthdayDate]);
  return (
    <section className="section countdown-section" id="countdown">
      <span className="eyebrow" data-aos="fade-up">look how far you’ve come</span>
      <div className="day-number" data-aos="zoom-in">{days.toLocaleString()}</div>
      <p className="section-lead" data-aos="fade-up" data-aos-delay="150">days of becoming even more amazing.</p>
      <span className="tiny-note">and somehow, you’re only getting started ✦</span>
    </section>
  );
}

export function GiftLetter({ model }: { model: BirthdayModel }) {
  const [open, setOpen] = useState(false);
  return (
    <section className={`section gift-section ${open ? "gift-open" : ""}`} id="letter">
      <div className="section-heading" data-aos="fade-up">
        <span className="eyebrow">something I’ve been meaning to say</span>
        <h2>A letter for you</h2>
      </div>
      <div className="gift-stage">
        <button className="gift-box" aria-label="Open your gift" aria-expanded={open} onClick={() => setOpen(true)}>
          <span className="gift-lid"><i /></span><span className="gift-body"><i /></span><span className="gift-glow" />
        </button>
        <div className="gift-sparks" aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>
        {!open && <p className="gift-hint">tap the gift to open it</p>}
        <article className="love-letter" aria-hidden={!open}>
          <div className="paper-flourish">✦</div>
          <span className="letter-to">{model.message.salutation}</span>
          {model.message.paragraphs.map((p, i) => <p key={p} style={{ "--delay": `${1.4 + i * 1.1}s` } as React.CSSProperties}>{p}</p>)}
          <span className="signature">{model.message.signature}</span>
        </article>
      </div>
    </section>
  );
}

function Gallery({ photos, index, close, setIndex }: { photos: Photo[]; index: number; close: () => void; setIndex: (n: number) => void }) {
  const move = useCallback((d: number) => setIndex((index + d + photos.length) % photos.length), [index, photos.length, setIndex]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key === "ArrowLeft") move(-1); if (e.key === "ArrowRight") move(1); };
    addEventListener("keydown", key); document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [close, move]);
  return (
    <div className="gallery" role="dialog" aria-modal="true" aria-label="Memory gallery" onClick={close}>
      <button className="gallery-close" onClick={close} aria-label="Close"><X /></button>
      <button className="gallery-nav prev" onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="Previous"><ChevronLeft /></button>
      <figure onClick={(e) => e.stopPropagation()}>
        <Image key={photos[index].src} src={photos[index].src} alt={photos[index].alt} width={1100} height={750} priority />
        <figcaption><span>{photos[index].date}</span>{photos[index].caption}</figcaption>
      </figure>
      <button className="gallery-nav next" onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="Next"><ChevronRight /></button>
    </div>
  );
}

export function MemoryLane({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <section className="section memories-section" id="memories">
      <div className="section-heading" data-aos="fade-up"><span className="eyebrow">snapshots of us</span><h2>Memory lane</h2><p>Little moments. Big feelings.</p></div>
      <div className="polaroid-grid">
        {photos.map((photo, i) => (
          <button className="polaroid" key={photo.id} onClick={() => setIndex(i)} data-aos="fade-up" data-aos-delay={(i % 3) * 100}>
            <Image src={photo.src} alt={photo.alt} width={500} height={600} loading="lazy" />
            <span>{photo.caption}</span><small>{photo.date}</small>
          </button>
        ))}
      </div>
      {index !== null && <Gallery photos={photos} index={index} setIndex={setIndex} close={() => setIndex(null)} />}
    </section>
  );
}

export function Timeline({ memories }: { memories: BirthdayModel["memories"] }) {
  return (
    <section className="section timeline-section">
      <div className="section-heading" data-aos="fade-up"><span className="eyebrow">chapters worth keeping</span><h2>Our little timeline</h2></div>
      <div className="timeline">
        {memories.map((m, i) => <article className="timeline-item" key={m.id} data-aos={i % 2 ? "fade-left" : "fade-right"}>
          <div className="timeline-image"><Image src={m.photo} alt="" width={500} height={350} loading="lazy" /></div>
          <div className="timeline-heart"><Heart size={16} fill="currentColor" /></div>
          <div className="timeline-copy"><time>{m.date}</time><h3>{m.title}</h3><p>{m.text}</p></div>
        </article>)}
      </div>
    </section>
  );
}

export function Reasons({ reasons }: { reasons: string[] }) {
  const [revealed, setRevealed] = useState(0);
  return (
    <section className="section reasons-section">
      <div className="section-heading" data-aos="fade-up"><span className="eyebrow">in case you ever forget</span><h2>Reasons I appreciate you</h2></div>
      <div className="reason-cloud">
        {reasons.map((reason, i) => <article key={reason} className={`reason-card ${i < revealed ? "revealed" : ""}`} style={{ "--r": `${(i % 5 - 2) * 2.2}deg`, "--delay": `${(i % 5) * .05}s` } as React.CSSProperties}><span>{String(i + 1).padStart(2, "0")}</span>{reason}</article>)}
      </div>
      <button className="pill-button" disabled={revealed === reasons.length} onClick={() => setRevealed(v => Math.min(reasons.length, v + 1))}>
        <Sparkles size={16} /> {revealed === 0 ? "Reveal a reason" : revealed === reasons.length ? "Every single one ♡" : "Reveal another"}
      </button>
    </section>
  );
}

export function Compliments({ compliments }: { compliments: BirthdayModel["compliments"] }) {
  const [queue, setQueue] = useState<number[]>([]);
  const [current, setCurrent] = useState("There’s something lovely you should know…");
  const next = () => {
    let available = compliments.map((_, i) => i).filter(i => !queue.includes(i));
    let history = queue;
    if (!available.length) { available = compliments.map((_, i) => i); history = []; }
    const pick = available[Math.floor(Math.random() * available.length)];
    setQueue([...history, pick]); setCurrent(compliments[pick].text);
  };
  return (
    <section className="section compliment-section">
      <div className="compliment-card" data-aos="zoom-in"><span className="eyebrow">a pocket-sized reminder</span><blockquote key={current}>{current}</blockquote><button className="pill-button" onClick={next}>Tell me something <Sparkles size={16} /></button></div>
    </section>
  );
}
