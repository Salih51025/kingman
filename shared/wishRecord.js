import { validateRequest } from "./validateRequest.js";

const SCENARIO_IDS = new Set([
  "knowledge",
  "treasure",
  "enchanted",
  "challenge",
  "default",
]);

export function sanitizeWishRecord(raw = {}) {
  const validation = validateRequest(raw.text ?? raw.request);
  if (!validation.ok) {
    return { ok: false, errorCode: validation.errorCode, error: validation.error };
  }

  const scenario = SCENARIO_IDS.has(raw.scenario) ? raw.scenario : null;
  return {
    ok: true,
    record: {
      text: validation.text,
      scenario,
      ultimate: Boolean(raw.ultimate),
    },
  };
}

export function publicWishPayload(record) {
  return {
    id: record.id,
    text: record.text,
    createdAt: record.createdAt,
    scenario: record.scenario,
    ultimate: Boolean(record.ultimate),
  };
}
