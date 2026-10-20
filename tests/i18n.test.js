import assert from "node:assert/strict";
import { test } from "node:test";
import { flattenKeys, translate, translations } from "../src/i18n/translations.js";
import { formatLog, formatScenario } from "../src/i18n/formatBattle.js";
import { classifyRequest, SCENARIOS } from "../shared/classifyRequest.js";
import { buildBattlePlan } from "../shared/battlePlan.js";
import { validateRequest, MAX_REQUEST_LENGTH } from "../shared/validateRequest.js";

test("Turkish and English translation tables cover the same keys", () => {
  const trKeys = flattenKeys(translations.tr).sort();
  const enKeys = flattenKeys(translations.en).sort();
  assert.deepEqual(trKeys, enKeys);
  assert.ok(trKeys.includes("welcome"));
  assert.ok(trKeys.includes("bubbles.idle"));
  assert.ok(trKeys.includes("bubbles.battle"));
  assert.ok(trKeys.includes("celebrate.heart"));
  assert.ok(trKeys.includes("dev.title"));
  assert.ok(trKeys.includes("form.submit"));
  assert.ok(trKeys.includes("form.expand"));
  assert.ok(trKeys.includes("form.collapse"));
  assert.ok(trKeys.includes("form.menu"));
  assert.ok(trKeys.includes("battle.enemyStrike"));
  assert.ok(!trKeys.includes("hud.note"));
});

test("UI messages differ by language while keys stay stable", () => {
  assert.equal(translate("tr", "welcome"), "Her macera bir dilekle başlar.");
  assert.equal(translate("en", "welcome"), "Every adventure begins with a wish.");
  assert.equal(
    translate("tr", "bubbles.idle"),
    "Her isteğinizi gerçekleştirmeye hazırım, efendim!",
  );
  assert.equal(
    translate("en", "bubbles.idle"),
    "I'm ready to make your every wish come true, my lord!",
  );
  assert.notEqual(translate("tr", "form.submit"), translate("en", "form.submit"));
  assert.equal(translate("tr", "celebrate.heart"), "Zafer kalbi");
  assert.equal(translate("en", "celebrate.heart"), "Victory heart");
});

test("language does not change scenario IDs", () => {
  const turkish = classifyRequest("kodlama projesi");
  const english = classifyRequest("coding project");
  assert.equal(turkish.scenario, SCENARIOS.KNOWLEDGE);
  assert.equal(english.scenario, SCENARIOS.KNOWLEDGE);
  const plan = buildBattlePlan("aşk ve aile");
  assert.equal(plan.scenario, SCENARIOS.ENCHANTED);
  assert.equal(formatScenario("tr", plan.scenario, "title"), "Yürek Rüzgârı Koruluğu");
  assert.equal(formatScenario("en", plan.scenario, "title"), "The Heartwind Grove");
});

test("battle log localizes from keys without changing script IDs", () => {
  const plan = buildBattlePlan("para ve iş");
  assert.equal(plan.ok, true);
  const attacks = plan.script.filter((step) => step.type === "attack");
  const strike = attacks[0];
  assert.equal(strike.textKey, "battle.strikes");
  assert.equal(strike.monsterType, "goblin");
  assert.equal(strike.damage, 1);
  assert.deepEqual(
    [...new Set(attacks.map((step) => step.variant))].sort(),
    [0, 1, 2],
  );
  const tr = formatLog("tr", strike);
  const en = formatLog("en", strike);
  assert.match(tr, /Hazine Goblini/);
  assert.match(en, /Coin Goblin/);
  assert.notEqual(tr, en);
});

test("empty input is rejected with a stable error code", () => {
  const result = validateRequest("   ");
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "empty");
  assert.equal(buildBattlePlan("").ok, false);
});

test("maximum request length is enforced", () => {
  const tooLong = "a".repeat(MAX_REQUEST_LENGTH + 1);
  const result = validateRequest(tooLong);
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "tooLong");
  assert.match(result.error, /300/);
});
