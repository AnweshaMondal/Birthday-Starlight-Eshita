"use client";

import { Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BirthdayModel } from "@/models/birthday";

export default function MusicPlayer({ music }: { music: BirthdayModel["music"] }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [missing, setMissing] = useState(false);
  const toggle = async () => { const a=audio.current;if(!a)return; if(a.paused){try{await a.play();setPlaying(true);setMissing(false);}catch{setPlaying(false);setMissing(true);}}else{a.pause();setPlaying(false);} };
  useEffect(()=>{const a=audio.current;if(!a)return;const time=()=>setProgress(a.duration?100*a.currentTime/a.duration:0);const end=()=>setPlaying(false);a.addEventListener("timeupdate",time);a.addEventListener("ended",end);return()=>{a.removeEventListener("timeupdate",time);a.removeEventListener("ended",end)}},[]);
  return <div className="music-player">
    <audio ref={audio} src={music.src} preload="metadata" loop onError={() => setMissing(true)} onCanPlay={() => setMissing(false)} />
    <button className={`music-main ${missing ? "missing" : ""}`} onClick={toggle} aria-label={playing?"Pause music":"Play music"}>{playing?<Pause/>:<Play/>}</button>
    <div className="music-info"><span><Music2 size={12}/>{missing ? "Music file missing" : music.title}</span><small>{missing ? "Add birthday-song.mp3" : music.artist}</small><input aria-label="Music progress" type="range" min="0" max="100" value={progress} disabled={missing} onChange={e=>{const a=audio.current;if(a?.duration)a.currentTime=(+e.target.value/100)*a.duration}} /></div>
    <button className="mute" onClick={()=>{if(audio.current){audio.current.muted=!muted;setMuted(!muted)}}} aria-label="Mute music">{muted?<VolumeX/>:<Volume2/>}</button>
  </div>;
}
