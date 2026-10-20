import { classifyRequest, SCENARIOS } from "./classifyRequest.js";
import { hasRomanticUltimate } from "./detectAffection.js";
import { validateRequest } from "./validateRequest.js";

const MONSTER_TEMPLATES = {
  slime: {
    type: "slime",
    maxHp: 3,
  },
  flyer: {
    type: "flyer",
    maxHp: 4,
  },
  goblin: {
    type: "goblin",
    maxHp: 4,
  },
};

const SCENARIO_PLANS = {
  [SCENARIOS.KNOWLEDGE]: {
    id: SCENARIOS.KNOWLEDGE,
    theme: "knowledge",
    monsters: [
      { ...MONSTER_TEMPLATES.slime, id: "m-know-1", maxHp: 3 },
      { ...MONSTER_TEMPLATES.slime, id: "m-know-2", maxHp: 3 },
    ],
  },
  [SCENARIOS.TREASURE]: {
    id: SCENARIOS.TREASURE,
    theme: "treasure",
    monsters: [
      { ...MONSTER_TEMPLATES.goblin, id: "m-gold-1", maxHp: 4 },
      { ...MONSTER_TEMPLATES.goblin, id: "m-gold-2", maxHp: 3 },
    ],
  },
  [SCENARIOS.ENCHANTED]: {
    id: SCENARIOS.ENCHANTED,
    theme: "enchanted",
    monsters: [
      { ...MONSTER_TEMPLATES.flyer, id: "m-love-1", maxHp: 4 },
      { ...MONSTER_TEMPLATES.flyer, id: "m-love-2", maxHp: 3 },
    ],
  },
  [SCENARIOS.CHALLENGE]: {
    id: SCENARIOS.CHALLENGE,
    theme: "challenge",
    monsters: [
      { ...MONSTER_TEMPLATES.goblin, id: "m-hard-1", maxHp: 5 },
      { ...MONSTER_TEMPLATES.flyer, id: "m-hard-2", maxHp: 4 },
      { ...MONSTER_TEMPLATES.slime, id: "m-hard-3", maxHp: 3 },
    ],
  },
  [SCENARIOS.DEFAULT]: {
    id: SCENARIOS.DEFAULT,
    theme: "default",
    monsters: [
      { ...MONSTER_TEMPLATES.slime, id: "m-def-1", maxHp: 3 },
      { ...MONSTER_TEMPLATES.goblin, id: "m-def-2", maxHp: 4 },
    ],
  },
};

export function buildBattlePlan(rawText) {
  const validation = validateRequest(rawText);
  if (!validation.ok) {
    return { ok: false, errorCode: validation.errorCode, error: validation.error };
  }

  const classified = classifyRequest(validation.text);
  const plan = SCENARIO_PLANS[classified.scenario];
  const monsters = plan.monsters.map((monster) => ({
    ...monster,
    hp: monster.maxHp,
  }));

  const script = [];
  script.push({
    type: "narrate",
    textKey: `scenarios.${plan.id}.intro`,
    delay: 900,
  });

  monsters.forEach((monster, index) => {
    script.push({
      type: "focus",
      targetId: monster.id,
      monsterType: monster.type,
      textKey: "battle.faces",
      delay: 700,
    });
    const hits = monster.maxHp;
    for (let hit = 1; hit <= hits; hit += 1) {
      script.push({
        type: "attack",
        targetId: monster.id,
        monsterType: monster.type,
        damage: 1,
        variant: (hit - 1) % 3,
        last: hit === hits,
        textKey: hit === hits ? "battle.falls" : "battle.strikes",
        delay: 720 + (hit % 3) * 40,
      });
      if (hit === 1 && hits > 1) {
        script.push({
          type: "enemyAttack",
          targetId: monster.id,
          monsterType: monster.type,
          textKey: "battle.enemyStrike",
          delay: 620,
        });
      }
    }
    if (index < monsters.length - 1) {
      script.push({
        type: "pause",
        textKey: "battle.next",
        delay: 420,
      });
    }
  });

  script.push({
    type: "victory",
    textKey: `scenarios.${plan.id}.victory`,
    delay: 520,
  });

  return {
    ok: true,
    request: validation.text,
    scenario: classified.scenario,
    theme: plan.theme,
    monsters,
    script,
    ultimate: hasRomanticUltimate(validation.text),
  };
}

export function usesNormalAttackScript(plan) {
  return Boolean(plan?.ok && !plan.ultimate);
}

export function shouldPlayEnemyAttack(step, context) {
  if (step?.type !== "enemyAttack") {
    return false;
  }
  if (context.finished || context.ultimate || context.attacking) {
    return false;
  }
  return (context.hp ?? 0) > 0;
}

export function shouldPlayVictoryCelebrate(plan, context = {}) {
  return Boolean(
    plan?.ok &&
      !plan.ultimate &&
      !context.ultimate &&
      !context.alreadyCelebrating,
  );
}
