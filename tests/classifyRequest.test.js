import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyRequest, normalizeWishText, SCENARIOS } from "../shared/classifyRequest.js";
import { buildBattlePlan } from "../shared/battlePlan.js";
import { validateRequest, MAX_REQUEST_LENGTH } from "../shared/validateRequest.js";

test("normalizes Turkish dotted and dotless I", () => {
  assert.equal(normalizeWishText("İŞ"), "is");
  assert.equal(normalizeWishText("ışık"), "isik");
  assert.equal(normalizeWishText("OKUL"), "okul");
});

test("learning keywords select knowledge scenario", () => {
  assert.equal(classifyRequest("Okul sınavı için çalışmak istiyorum").scenario, SCENARIOS.KNOWLEDGE);
  assert.equal(classifyRequest("I want to learn coding").scenario, SCENARIOS.KNOWLEDGE);
});

test("money keywords select treasure scenario", () => {
  assert.equal(classifyRequest("Daha iyi bir kariyer ve para").scenario, SCENARIOS.TREASURE);
  assert.equal(classifyRequest("A better job and salary").scenario, SCENARIOS.TREASURE);
});

test("relationship keywords select enchanted scenario", () => {
  assert.equal(classifyRequest("Ailem ve arkadaşlık").scenario, SCENARIOS.ENCHANTED);
  assert.equal(classifyRequest("I wish for love").scenario, SCENARIOS.ENCHANTED);
});

test("fear keywords select challenge scenario", () => {
  assert.equal(classifyRequest("Korku ve zorluklarla baş etmek").scenario, SCENARIOS.CHALLENGE);
  assert.equal(classifyRequest("I face many problems and fear").scenario, SCENARIOS.CHALLENGE);
});

test("unknown text uses fallback scenario", () => {
  assert.equal(classifyRequest("xyz qwerty banana moonlight").scenario, SCENARIOS.DEFAULT);
});

test("different categories produce different monster types", () => {
  const knowledge = buildBattlePlan("kodlama projesi");
  const treasure = buildBattlePlan("para ve iş");
  const enchanted = buildBattlePlan("aşk ve aile");
  assert.notEqual(knowledge.scenario, treasure.scenario);
  assert.notEqual(treasure.scenario, enchanted.scenario);
  assert.ok(knowledge.monsters.every((monster) => monster.type === "slime"));
  assert.ok(treasure.monsters.every((monster) => monster.type === "goblin"));
  assert.ok(enchanted.monsters.every((monster) => monster.type === "flyer"));
});

test("empty input is rejected", () => {
  assert.equal(validateRequest("   ").ok, false);
  assert.equal(buildBattlePlan("").ok, false);
});

test("maximum request length is enforced", () => {
  const tooLong = "a".repeat(MAX_REQUEST_LENGTH + 1);
  const result = validateRequest(tooLong);
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "tooLong");
  assert.match(result.error, /300/);
});
