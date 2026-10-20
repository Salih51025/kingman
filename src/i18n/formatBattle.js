import { translate } from "./translations.js";

export function formatLog(lang, step) {
  if (!step?.textKey) {
    return "";
  }
  const name = step.monsterType ? translate(lang, `monsters.${step.monsterType}`) : "";
  return translate(lang, step.textKey, { name });
}

export function formatScenario(lang, scenarioId, field) {
  return translate(lang, `scenarios.${scenarioId}.${field}`);
}
