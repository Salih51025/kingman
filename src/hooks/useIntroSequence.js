import { useEffect, useState } from "react";

export const INTRO_STATES = [
  "INTRO",
  "ARRIVAL",
  "MESSAGE",
  "SWORD_RAISE",
  "SWORD_SLAM",
  "IMPACT",
  "REST",
  "REQUEST_READY",
];

const FULL_TIMELINE = [
  ["INTRO", 0],
  ["ARRIVAL", 1600],
  ["MESSAGE", 900],
  ["SWORD_RAISE", 1400],
  ["SWORD_SLAM", 700],
  ["IMPACT", 450],
  ["REST", 700],
  ["REQUEST_READY", 650],
];

const REDUCED_TIMELINE = [
  ["INTRO", 0],
  ["REQUEST_READY", 80],
];

export function useIntroSequence() {
  const [phase, setPhase] = useState("INTRO");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeline = reduced ? REDUCED_TIMELINE : FULL_TIMELINE;
    const timers = [];
    let elapsed = 0;

    timeline.forEach(([nextPhase, delay]) => {
      elapsed += delay;
      timers.push(
        window.setTimeout(() => {
          setPhase(nextPhase);
        }, elapsed),
      );
    });

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return phase;
}
