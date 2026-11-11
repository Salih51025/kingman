import { useCallback, useEffect, useRef, useState } from "react";
import { resolveBattle } from "../api/battleClient.js";
import { recordWish } from "../api/wishClient.js";
import {
  shouldPlayEnemyAttack,
  shouldPlayVictoryCelebrate,
  usesNormalAttackScript,
} from "../../shared/battlePlan.js";
import { validateRequest } from "../../shared/validateRequest.js";
import { hasDanceCommand } from "../../shared/detectDance.js";

const CONTACT_MS = { 0: 270, 1: 330, 2: 310 };
const RECOVER_MS = { 0: 540, 1: 600, 2: 560 };

export function useBattle() {
  const [status, setStatus] = useState("idle");
  const [errorCode, setErrorCode] = useState("");
  const [plan, setPlan] = useState(null);
  const [monsters, setMonsters] = useState([]);
  const [logStep, setLogStep] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const [hitId, setHitId] = useState(null);
  const [attacking, setAttacking] = useState(false);
  const [attackVariant, setAttackVariant] = useState(0);
  const [showBattleSpeech, setShowBattleSpeech] = useState(false);
  const [jumpPhase, setJumpPhase] = useState("");
  const [ultimatePhase, setUltimatePhase] = useState("");
  const [hitAll, setHitAll] = useState(false);
  const [enemyAttackId, setEnemyAttackId] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [victoryPhase, setVictoryPhase] = useState("");
  const [showVictoryHeart, setShowVictoryHeart] = useState(false);
  const timers = useRef([]);
  const mounted = useRef(true);
  const speechShown = useRef(false);
  const attackingLock = useRef(false);
  const ultimateLock = useRef(false);
  const finished = useRef(false);
  const monstersRef = useRef([]);
  const celebrateLock = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const later = useCallback((fn, delay) => {
    const id = window.setTimeout(() => {
      if (mounted.current) {
        fn();
      }
    }, delay);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    monstersRef.current = monsters;
  }, [monsters]);

  const playUltimate = useCallback(
    (reduced) => {
      if (ultimateLock.current) {
        return;
      }
      ultimateLock.current = true;
      attackingLock.current = true;
      setStatus("ultimate");
      setLogStep({ textKey: "ultimate.line" });
      setUltimatePhase("awaken");
      setShowBattleSpeech(true);

      const beat = reduced ? 40 : 700;
      later(() => {
        setUltimatePhase("strike");
        setLogStep({ textKey: "ultimate.awaken" });
      }, beat);
      later(() => {
        setHitAll(true);
        setMonsters((current) => current.map((monster) => ({ ...monster, hp: 0 })));
      }, beat + (reduced ? 30 : 380));
      later(() => {
        setHitAll(false);
        setShowBattleSpeech(false);
        setUltimatePhase("return");
      }, beat + (reduced ? 80 : 900));
      later(() => {
        setUltimatePhase("kneel");
        setJumpPhase("");
      }, beat + (reduced ? 120 : 1600));
      later(() => {
        setUltimatePhase("flower");
        setLogStep({ textKey: "ultimate.flower" });
      }, beat + (reduced ? 160 : 2200));
      later(() => {
        finished.current = true;
        setStatus("complete");
        attackingLock.current = false;
      }, beat + (reduced ? 200 : 2800));
    },
    [later],
  );

  const playCelebrate = useCallback(
    (reduced) => {
      if (celebrateLock.current || ultimateLock.current) {
        return;
      }
      celebrateLock.current = true;
      attackingLock.current = true;
      setStatus("celebrate");
      setShowBattleSpeech(false);

      if (reduced) {
        setVictoryPhase("raise");
        setShowVictoryHeart(true);
        later(() => {
          setShowVictoryHeart(false);
          setVictoryPhase("");
          setStatus("complete");
          attackingLock.current = false;
        }, 80);
        return;
      }

      later(() => setVictoryPhase("plant"), 560);
      later(() => setVictoryPhase("raise"), 980);
      later(() => {
        setVictoryPhase("leap");
        setShowVictoryHeart(true);
      }, 1320);
      later(() => setVictoryPhase("land"), 1840);
      later(() => setVictoryPhase("recover"), 2160);
      later(() => setShowVictoryHeart(false), 2760);
      later(() => {
        setVictoryPhase("");
        setStatus("complete");
        attackingLock.current = false;
      }, 3040);
    },
    [later],
  );

  const playScript = useCallback(
    (result, reduced) => {
      if (!usesNormalAttackScript(result)) {
        playUltimate(reduced);
        return;
      }
      finished.current = false;
      setStatus("intro");
      setLogStep(result.script[0] || { textKey: `scenarios.${result.scenario}.intro` });
      let elapsed = reduced ? 40 : 280;

      result.script.forEach((step) => {
        elapsed += reduced ? 40 : step.delay;
        later(() => {
          if (step.type === "narrate" || step.type === "pause" || step.type === "focus") {
            setLogStep(step);
            if (step.targetId) {
              setFocusId(step.targetId);
            }
            setStatus("running");
            if (!speechShown.current) {
              speechShown.current = true;
              setShowBattleSpeech(true);
              later(() => setShowBattleSpeech(false), reduced ? 200 : 3800);
            }
          }

          if (step.type === "enemyAttack") {
            const target = monstersRef.current.find((monster) => monster.id === step.targetId);
            if (
              !shouldPlayEnemyAttack(step, {
                finished: finished.current,
                ultimate: ultimateLock.current,
                attacking: attackingLock.current,
                hp: target?.hp ?? 0,
              })
            ) {
              return;
            }
            setEnemyAttackId(step.targetId);
            setLogStep(step);
            later(() => setBlocking(true), reduced ? 20 : 180);
            later(() => {
              setEnemyAttackId("");
              setBlocking(false);
            }, reduced ? 80 : 560);
          }

          if (step.type === "attack") {
            if (attackingLock.current || ultimateLock.current || finished.current) {
              return;
            }
            attackingLock.current = true;
            const variant = step.variant ?? 0;
            setAttacking(true);
            setAttackVariant(variant);
            setLogStep(step);
            setFocusId(step.targetId);
            later(() => {
              setHitId(step.targetId);
              setMonsters((current) =>
                current.map((monster) =>
                  monster.id === step.targetId
                    ? { ...monster, hp: Math.max(0, monster.hp - step.damage) }
                    : monster,
                ),
              );
            }, reduced ? 20 : CONTACT_MS[variant] ?? 270);
            later(() => {
              setAttacking(false);
              setHitId(null);
              attackingLock.current = false;
            }, reduced ? 80 : RECOVER_MS[variant] ?? 540);
          }

          if (step.type === "victory") {
            finished.current = true;
            attackingLock.current = false;
            setAttacking(false);
            setHitId(null);
            setFocusId(null);
            setLogStep(step);
            setShowBattleSpeech(false);
            if (
              shouldPlayVictoryCelebrate(result, {
                ultimate: ultimateLock.current,
                alreadyCelebrating: celebrateLock.current,
              })
            ) {
              playCelebrate(reduced);
            } else {
              setStatus("complete");
            }
          }
        }, elapsed);
      });
    },
    [later, playCelebrate, playUltimate],
  );

  const submitWish = useCallback(
    async (rawText) => {
      const validation = validateRequest(rawText);
      if (!validation.ok) {
        setErrorCode(validation.errorCode);
        return;
      }

      if (
        status === "loading" ||
        status === "dancing" ||
        status === "approach" ||
        status === "running" ||
        status === "intro" ||
        status === "ultimate" ||
        status === "celebrate"
      ) {
        return;
      }

      clearTimers();
      speechShown.current = false;
      attackingLock.current = false;
      ultimateLock.current = false;
      finished.current = false;
      celebrateLock.current = false;
      setErrorCode("");
      setStatus("loading");
      setJumpPhase("");
      setUltimatePhase("");
      setVictoryPhase("");
      setShowVictoryHeart(false);
      setHitAll(false);
      setEnemyAttackId("");
      setBlocking(false);
      setLogStep({ textKey: "battle.listens" });
      setPlan(null);
      setMonsters([]);
      setFocusId(null);
      setHitId(null);
      setAttacking(false);
      setShowBattleSpeech(false);

      if (hasDanceCommand(validation.text)) {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setStatus("dancing");
        later(() => setStatus("complete"), reduced ? 80 : 4000);
        return;
      }

      const result = await resolveBattle(validation.text);
      if (!mounted.current) {
        return;
      }
      if (!result.ok) {
        setErrorCode(result.errorCode || "unreadable");
        setStatus("idle");
        setJumpPhase("");
        setUltimatePhase("");
        return;
      }

      setPlan(result);
      setMonsters(result.monsters);
      recordWish({
        text: validation.text,
        scenario: result.scenario,
        ultimate: Boolean(result.ultimate),
      });

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setJumpPhase("ready");
        playScript(result, true);
        return;
      }

      setStatus("approach");
      setJumpPhase("crouch");
      later(() => setJumpPhase("jump"), 220);
      later(() => setJumpPhase("land"), 820);
      later(() => {
        setJumpPhase("ready");
        playScript(result, false);
      }, 1040);
    },
    [clearTimers, later, playScript, status],
  );

  const resetBattle = useCallback(() => {
    clearTimers();
    speechShown.current = false;
    attackingLock.current = false;
    ultimateLock.current = false;
    finished.current = false;
    celebrateLock.current = false;
    setStatus("idle");
    setErrorCode("");
    setPlan(null);
    setMonsters([]);
    setLogStep(null);
    setFocusId(null);
    setHitId(null);
    setAttacking(false);
    setShowBattleSpeech(false);
    setJumpPhase("");
    setUltimatePhase("");
    setVictoryPhase("");
    setShowVictoryHeart(false);
    setHitAll(false);
    setEnemyAttackId("");
    setBlocking(false);
  }, [clearTimers]);

  return {
    status,
    errorCode,
    plan,
    monsters,
    logStep,
    focusId,
    hitId,
    attacking,
    attackVariant,
    showBattleSpeech,
    jumpPhase,
    ultimatePhase,
    hitAll,
    enemyAttackId,
    blocking,
    victoryPhase,
    showVictoryHeart,
    submitWish,
    resetBattle,
    busy:
      status === "loading" ||
      status === "approach" ||
      status === "running" ||
      status === "intro" ||
      status === "ultimate" ||
      status === "celebrate",
  };
}
