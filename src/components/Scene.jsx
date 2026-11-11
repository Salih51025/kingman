import { useEffect, useState } from "react";
import Arena from "./Arena.jsx";
import Knight from "./Knight.jsx";
import Monster from "./Monster.jsx";
import RequestForm from "./RequestForm.jsx";
import BattleHud from "./BattleHud.jsx";
import SpeechBubble from "./SpeechBubble.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import { useI18n } from "../i18n/LanguageContext.jsx";
import { wishPanelCollapsed } from "../ui/wishPanel.js";

export default function Scene({
  phase,
  battle,
  formVisible,
}) {
  const { t } = useI18n();
  const [userExpanded, setUserExpanded] = useState(false);
  const jumpPhase = battle.jumpPhase;
  const ultimatePhase = battle.ultimatePhase;
  const victoryPhase = battle.victoryPhase;
  const inBattle = battle.status !== "idle";
  const inUltimate = battle.status === "ultimate" || Boolean(ultimatePhase);
  const dancing = battle.status === "dancing";
  const celebrating = battle.status === "celebrate" || Boolean(victoryPhase);
  const onField =
    ["ready", "land"].includes(jumpPhase) ||
    battle.status === "running" ||
    dancing ||
    battle.status === "intro" ||
    celebrating ||
    (inUltimate && ["awaken", "strike"].includes(ultimatePhase));
  const idle = formVisible && battle.status === "idle";
  const shake = phase === "IMPACT" && !inBattle;
  const showWelcome =
    !inBattle &&
    ["MESSAGE", "SWORD_RAISE", "SWORD_SLAM", "IMPACT", "REST", "REQUEST_READY"].includes(phase);
  const collapsed = wishPanelCollapsed(battle.status, userExpanded);

  useEffect(() => {
    if (battle.status === "loading" || battle.status === "approach") {
      setUserExpanded(false);
    }
  }, [battle.status]);

  return (
    <main
      className={[
        "scene",
        `theme-${battle.plan?.theme || "night"}`,
        shake ? "is-shaking" : "",
        inUltimate ? "is-ultimate" : "",
      ].join(" ")}
    >
      <LanguageToggle />
      <div className="sky">
        <span className="star s1" />
        <span className="star s2" />
        <span className="star s3" />
        <span className="star s4" />
        <span className="star s5" />
      </div>
      <Arena />
      <div className="ground" />
      {inUltimate ? <div className="ultimate-veil" /> : null}

      {showWelcome ? <p className="welcome">{t("welcome")}</p> : null}

      {phase === "IMPACT" ? (
        <div className="impact">
          <span />
          <span />
          <span />
        </div>
      ) : null}

      <div
        className={[
          "actor-stage",
          `phase-${phase.toLowerCase()}`,
          jumpPhase ? `jump-${jumpPhase}` : "",
          ultimatePhase ? `ultimate-${ultimatePhase}` : "",
          victoryPhase ? `celebrate-${victoryPhase}` : "",
          onField ? "is-fighting" : "",
          dancing ? "is-dancing" : "",
          idle ? "is-idle" : "",
        ].join(" ")}
      >
        <div className="actor-rig">
          <Knight
            phase={phase}
            attacking={battle.attacking}
            attackVariant={battle.attackVariant}
            inBattle={onField}
            idle={idle}
            jumpPhase={jumpPhase}
            ultimatePhase={ultimatePhase}
            blocking={battle.blocking}
            victoryPhase={victoryPhase}
            showVictoryHeart={battle.showVictoryHeart}
          />
          {idle ? <SpeechBubble text={t("bubbles.idle")} variant="idle" /> : null}
          {battle.showBattleSpeech ? (
            <SpeechBubble text={t("bubbles.battle")} variant="battle" />
          ) : null}
        </div>
      </div>

      {inBattle ? (
        <div className={`monster-row count-${battle.monsters.length}`}>
          {battle.monsters.map((monster) => (
            <Monster
              key={monster.id}
              monster={monster}
              focused={battle.focusId === monster.id}
              hit={battle.hitId === monster.id || battle.hitAll}
              striking={battle.enemyAttackId === monster.id}
              variant={battle.hitAll ? "ultimate" : battle.attackVariant}
            />
          ))}
        </div>
      ) : null}

      <BattleHud
        plan={battle.plan}
        logStep={battle.logStep}
        complete={battle.status === "complete"}
      />

      <RequestForm
        visible={formVisible}
        disabled={battle.busy}
        errorCode={battle.errorCode}
        onSubmit={battle.submitWish}
        onReset={battle.resetBattle}
        canReset={battle.status === "complete"}
        collapsed={collapsed}
        onToggle={inBattle ? () => setUserExpanded((open) => !open) : undefined}
      />
    </main>
  );
}
