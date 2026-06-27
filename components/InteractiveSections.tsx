"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, LockKeyhole, RotateCcw, Sparkles, X } from "lucide-react";
import type { BirthdayModel } from "@/models/birthday";

export function Constellation() {
  const stars = useMemo(() => [
    [5,40],[12,25],[18,48],[24,20],[30,58],[36,29],[42,62],[48,34],[54,52],[60,24],[66,58],[72,30],[78,49],[86,22],[93,42]
  ], []);
  return (
    <section className="constellation-section" data-aos="fade-in">
      <div className="constellation-sky">
        {Array.from({ length: 55 }, (_, i) => <i className="bg-star" key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 61) % 100}%`, animationDelay: `${i % 7}s` }} />)}
        <svg viewBox="0 0 100 75" aria-hidden="true">
          <polyline points={stars.map(s => s.join(",")).join(" ")} />
          {stars.map(([x,y], i) => <circle key={i} cx={x} cy={y} r=".7" style={{ animationDelay: `${i * .12}s` }} />)}
        </svg>
        <div className="constellation-message"><span>the stars have a message</span><h2>You’re Amazing</h2></div>
      </div>
    </section>
  );
}

const solved = [0,1,2,3,4,5,6,7,8];
export function PhotoPuzzle({ message }: { message: string }) {
  const initial = useMemo(() => [4, 0, 7, 2, 8, 3, 1, 6, 5], []);
  const [pieces, setPieces] = useState(initial);
  const [selected, setSelected] = useState<number | null>(null);
  const complete = pieces.every((n, i) => n === i);
  const choose = (i: number) => {
    if (complete) return;
    if (selected === null) return setSelected(i);
    const copy = [...pieces]; [copy[selected], copy[i]] = [copy[i], copy[selected]]; setPieces(copy); setSelected(null);
  };
  return (
    <section className="section puzzle-section">
      <div className="section-heading" data-aos="fade-up"><span className="eyebrow">piece it together</span><h2>One lovely little puzzle</h2><p>Tap two pieces to swap them.</p></div>
      <div className={`puzzle ${complete ? "complete" : ""}`} data-aos="zoom-in">
        {pieces.map((piece, slot) => <button key={slot} aria-label={`Puzzle piece ${slot + 1}`} className={selected === slot ? "selected" : ""} onClick={() => choose(slot)} style={{ backgroundPosition: `${(piece % 3) * 50}% ${Math.floor(piece / 3) * 50}%` }} />)}
      </div>
      <div className={`puzzle-message ${complete ? "show" : ""}`}>{message}</div>
      <button className="text-button" onClick={() => { setPieces(complete ? initial : solved); setSelected(null); }}>{complete ? <><RotateCcw size={14}/> Play again</> : "A tiny hint? Solve it for me"}</button>
    </section>
  );
}

export function SecretHeart({ model }: { model: BirthdayModel }) {
  const [open, setOpen] = useState(false);
  return <>
    <button className="secret-heart" onClick={() => setOpen(true)} aria-label="A hidden heart"><Heart fill="currentColor" size={15} /></button>
    {open && <div className="secret-modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
      <div className="secret-card" onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpen(false)} aria-label="Close"><X /></button>
        <LockKeyhole size={24} /><span className="eyebrow">secret unlocked</span><h2>Just between us…</h2><p>{model.message.secret}</p>
        <div className="secret-photos">{model.secretPhotos.map(p => <figure key={p.id}><Image src={p.src} alt={p.alt} width={400} height={300} /><figcaption>{p.caption}</figcaption></figure>)}</div>
      </div>
    </div>}
  </>;
}

function Fireworks({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const canvas = ref.current, ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = innerWidth; canvas.height = innerHeight;
    type P = {x:number;y:number;vx:number;vy:number;life:number;color:string};
    let ps: P[] = [], frame = 0, last = 0;
    const burst = () => { const x = Math.random()*canvas.width, y = canvas.height*(.12+Math.random()*.45), color = ["#f8c8dc","#e4d1ff","#ffd98e","#fff"][Math.floor(Math.random()*4)]; for(let i=0;i<65;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*3;ps.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,color});}};
    const loop = (t:number) => { if(t-last>700){burst();last=t;} ctx.fillStyle="rgba(8,5,20,.16)";ctx.fillRect(0,0,canvas.width,canvas.height); ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.018;p.life-=.009;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,2,2)});ctx.globalAlpha=1;ps=ps.filter(p=>p.life>0);frame=requestAnimationFrame(loop);};
    frame=requestAnimationFrame(loop); return()=>cancelAnimationFrame(frame);
  }, [active]);
  return <canvas className="fireworks" ref={ref} />;
}

export function FinalSurprise({ lines }: { lines: string[] }) {
  const [active, setActive] = useState(false);
  useEffect(() => { if (active) document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, [active]);
  return (
    <section className="section finale-section">
      <span className="eyebrow" data-aos="fade-up">before you go</span><h2 data-aos="fade-up">There’s one more thing…</h2>
      <button className="final-button" onClick={() => setActive(true)}><Sparkles /> One Last Surprise</button>
      {active && <div className="final-overlay">
        <Fireworks active={active} />
        <div className="lanterns" aria-hidden="true">{Array.from({length: 18},(_,i)=><i key={i} style={{"--i":i,left:`${(i*37)%100}%`} as React.CSSProperties}/>)}</div>
        <button className="final-close" onClick={() => setActive(false)} aria-label="Close"><X /></button>
        <div className="final-message">{lines.map((line,i)=><p key={line} style={{animationDelay:`${1+i*.9}s`}}>{line}</p>)}</div>
        <div className="heart-field" aria-hidden="true">{Array.from({length:35},(_,i)=><Heart key={i} fill="currentColor" style={{"--i":i,left:`${(i*29)%100}%`} as React.CSSProperties}/>)}</div>
      </div>}
    </section>
  );
}
