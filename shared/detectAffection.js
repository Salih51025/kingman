import { normalizeWishText } from "./classifyRequest.js";

const AFFECTION_TOKENS = new Set([
  "canim",
  "askim",
  "sevgilim",
  "seviyorum",
  "hoslaniyorum",
  "harikasin",
  "guzelim",
  "guzelligim",
  "birtanem",
  "hayatim",
  "bebegim",
  "balim",
  "tatlim",
  "melegim",
  "prensesim",
  "darling",
  "sweetheart",
  "honey",
  "baby",
  "beautiful",
  "gorgeous",
  "beloved",
  "princess",
  "amazing",
  "wonderful",
]);

const AFFECTION_PHRASES = [
  "my love",
  "i love you",
  "cok iyisin",
  "you re wonderful",
  "youre wonderful",
  "you are wonderful",
];

export function hasRomanticUltimate(rawText) {
  const normalized = normalizeWishText(rawText);
  if (!normalized) {
    return false;
  }

  const padded = ` ${normalized} `;
  if (AFFECTION_PHRASES.some((phrase) => padded.includes(` ${phrase} `))) {
    return true;
  }

  const tokens = normalized.split(" ").filter(Boolean);
  return tokens.some((token) => AFFECTION_TOKENS.has(token));
}
