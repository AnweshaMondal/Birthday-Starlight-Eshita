"use client";

import { useEffect } from "react";
import AOS from "aos";
import type { BirthdayModel } from "@/models/birthday";
import Landing from "./Landing";
import FloatingHearts from "./effects/FloatingHearts";
import { Compliments, Countdown, GiftLetter, MemoryLane, Reasons, Timeline } from "./StorySections";
import { Constellation, FinalSurprise, PhotoPuzzle, SecretHeart } from "./InteractiveSections";
import MusicPlayer from "./MusicPlayer";

export default function BirthdayExperience({ model }: { model: BirthdayModel }) {
  useEffect(() => { AOS.init({ duration: 900, once: true, offset: 70, easing: "ease-out-cubic", disable: matchMedia("(prefers-reduced-motion: reduce)").matches }); }, []);
  return <main>
    <Landing greeting={model.message.greeting} recipientLine={model.message.recipientLine} />
    <FloatingHearts />
    <Countdown birthdayDate={model.birthdayDate} />
    <GiftLetter model={model} />
    <MemoryLane photos={model.photos} />
    <Timeline memories={model.memories} />
    <Reasons reasons={model.reasons} />
    <Constellation />
    <Compliments compliments={model.compliments} />
    <PhotoPuzzle message={model.message.puzzleComplete} />
    <FinalSurprise lines={model.message.finalLines} />
    <footer>Made with <HeartIcon /> especially for you <span>·</span> {new Date().getFullYear()}</footer>
    <SecretHeart model={model} />
    <MusicPlayer music={model.music} />
  </main>;
}

function HeartIcon(){return <span className="footer-heart">♥</span>}
