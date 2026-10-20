import assert from "node:assert/strict";
import { test } from "node:test";
import { hasRomanticUltimate } from "../shared/detectAffection.js";
import { classifyRequest, SCENARIOS } from "../shared/classifyRequest.js";
import { buildBattlePlan, shouldPlayEnemyAttack, shouldPlayVictoryCelebrate, usesNormalAttackScript } from "../shared/battlePlan.js";
import { wishPanelCollapsed } from "../src/ui/wishPanel.js";

test("Turkish affectionate phrases trigger the ultimate", () => {
  assert.equal(hasRomanticUltimate("Canım, sana bir dileğim var"), true);
  assert.equal(hasRomanticUltimate("Seni seviyorum aşkım"), true);
  assert.equal(hasRomanticUltimate("Güzelim ve prensesim"), true);
  assert.equal(hasRomanticUltimate("Seni çok seviyorum"), true);
  assert.equal(hasRomanticUltimate("Çok iyisin, harikasın"), true);
  assert.equal(hasRomanticUltimate("Senden hoşlanıyorum, güzelliğim"), true);
});

test("English affectionate phrases trigger the ultimate", () => {
  assert.equal(hasRomanticUltimate("I have a wish, my love"), true);
  assert.equal(hasRomanticUltimate("Hello darling"), true);
  assert.equal(hasRomanticUltimate("A wish for my sweetheart"), true);
  assert.equal(hasRomanticUltimate("I love you"), true);
  assert.equal(hasRomanticUltimate("You are amazing and gorgeous"), true);
  assert.equal(hasRomanticUltimate("You're wonderful"), true);
});

test("handles case, punctuation, and Turkish I", () => {
  assert.equal(hasRomanticUltimate("CANIM!!!"), true);
  assert.equal(hasRomanticUltimate("AŞKIM"), true);
  assert.equal(hasRomanticUltimate("My Love."), true);
});

test("unrelated requests do not trigger the ultimate", () => {
  assert.equal(hasRomanticUltimate("Okul sınavı için çalışmak istiyorum"), false);
  assert.equal(hasRomanticUltimate("I want a better job and salary"), false);
  assert.equal(hasRomanticUltimate("sevgili değil sadece okul"), false);
  assert.equal(hasRomanticUltimate("I wish for love and family"), false);
  assert.equal(hasRomanticUltimate("canal project"), false);
});

test("existing categories still classify when the ultimate is present or absent", () => {
  assert.equal(classifyRequest("kodlama projesi").scenario, SCENARIOS.KNOWLEDGE);
  const romantic = buildBattlePlan("Canım, sana bir dileğim var");
  assert.equal(romantic.ok, true);
  assert.equal(romantic.ultimate, true);
  assert.ok(romantic.monsters.length > 0);
  const school = buildBattlePlan("okul sınavı");
  assert.equal(school.ultimate, false);
  assert.equal(school.scenario, SCENARIOS.KNOWLEDGE);
});

test("ultimate defeats every listed enemy exactly once in plan data", () => {
  const plan = buildBattlePlan("my love, please help");
  assert.equal(plan.ultimate, true);
  const ids = plan.monsters.map((monster) => monster.id);
  assert.equal(new Set(ids).size, ids.length);
  const defeated = plan.monsters.map((monster) => ({ ...monster, hp: 0 }));
  assert.ok(defeated.every((monster) => monster.hp === 0));
  assert.equal(defeated.length, plan.monsters.length);
});

test("ultimate flag prevents treating the request as a normal-only plan", () => {
  const plan = buildBattlePlan("hayatım");
  assert.equal(plan.ultimate, true);
  assert.notEqual(plan.script[0]?.textKey, "ultimate.line");
});

test("wish panel stays expanded before battle and collapses unless the user opens it", () => {
  assert.equal(wishPanelCollapsed("idle", false), false);
  assert.equal(wishPanelCollapsed("running", false), true);
  assert.equal(wishPanelCollapsed("running", true), false);
  assert.equal(wishPanelCollapsed("ultimate", false), true);
  assert.equal(wishPanelCollapsed("celebrate", false), true);
});

test("normal victory celebrate is separate from the romantic ultimate", () => {
  const ordinary = buildBattlePlan("okul sınavı");
  const ultimate = buildBattlePlan("canım");
  assert.equal(shouldPlayVictoryCelebrate(ordinary), true);
  assert.equal(shouldPlayVictoryCelebrate(ultimate), false);
  assert.equal(shouldPlayVictoryCelebrate(ordinary, { ultimate: true }), false);
  assert.equal(shouldPlayVictoryCelebrate(ordinary, { alreadyCelebrating: true }), false);
  assert.equal(usesNormalAttackScript(ordinary), true);
  assert.equal(usesNormalAttackScript(ultimate), false);
});

test("enemy attacks are scripted before victory and not after", () => {
  const plan = buildBattlePlan("okul sınavı");
  const victoryAt = plan.script.findIndex((step) => step.type === "victory");
  const enemySteps = plan.script.filter((step) => step.type === "enemyAttack");
  assert.ok(enemySteps.length > 0);
  assert.ok(
    plan.script.every((step, index) => step.type !== "enemyAttack" || index < victoryAt),
  );
});

test("ultimate plans skip the normal attack script", () => {
  const ultimate = buildBattlePlan("canım");
  const ordinary = buildBattlePlan("okul sınavı");
  assert.equal(usesNormalAttackScript(ultimate), false);
  assert.equal(usesNormalAttackScript(ordinary), true);
});

test("enemy attacks stop after victory or enemy defeat", () => {
  const step = { type: "enemyAttack", targetId: "m-know-1" };
  assert.equal(shouldPlayEnemyAttack(step, { finished: false, ultimate: false, attacking: false, hp: 2 }), true);
  assert.equal(shouldPlayEnemyAttack(step, { finished: true, ultimate: false, attacking: false, hp: 2 }), false);
  assert.equal(shouldPlayEnemyAttack(step, { finished: false, ultimate: true, attacking: false, hp: 2 }), false);
  assert.equal(shouldPlayEnemyAttack(step, { finished: false, ultimate: false, attacking: false, hp: 0 }), false);
});
