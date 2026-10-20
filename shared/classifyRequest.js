/**
 * Deterministic, rule-based wish classifier.
 * Uses Turkish locale folding and word-boundary matching.
 */

export const SCENARIOS = {
  KNOWLEDGE: "knowledge",
  TREASURE: "treasure",
  ENCHANTED: "enchanted",
  CHALLENGE: "challenge",
  DEFAULT: "default",
};

const CATEGORY_KEYWORDS = {
  [SCENARIOS.KNOWLEDGE]: [
    "ogren",
    "ogrenmek",
    "okul",
    "sinav",
    "ders",
    "universite",
    "odev",
    "kod",
    "kodlama",
    "yazilim",
    "program",
    "proje",
    "bilgi",
    "kitap",
    "calis",
    "learn",
    "learning",
    "school",
    "exam",
    "exams",
    "study",
    "coding",
    "code",
    "project",
    "projects",
    "homework",
    "university",
    "knowledge",
  ],
  [SCENARIOS.TREASURE]: [
    "para",
    "maas",
    "is",
    "kariyer",
    "isletme",
    "ticaret",
    "zengin",
    "servet",
    "altin",
    "money",
    "work",
    "job",
    "career",
    "business",
    "salary",
    "gold",
    "treasure",
    "wealth",
    "rich",
  ],
  [SCENARIOS.ENCHANTED]: [
    "ask",
    "sevgi",
    "sevgili",
    "arkadas",
    "arkadaslik",
    "aile",
    "kalp",
    "dost",
    "evlilik",
    "love",
    "friend",
    "friendship",
    "family",
    "relationship",
    "heart",
    "romance",
  ],
  [SCENARIOS.CHALLENGE]: [
    "korku",
    "korkmak",
    "problem",
    "sorun",
    "zorluk",
    "engel",
    "tehlike",
    "dusman",
    "challenge",
    "challenges",
    "fear",
    "problem",
    "problems",
    "difficulty",
    "difficulties",
    "hardship",
    "obstacle",
  ],
};

function foldTurkishChar(char) {
  const map = {
    İ: "i",
    I: "i",
    ı: "i",
    i: "i",
    Ş: "s",
    ş: "s",
    Ğ: "g",
    ğ: "g",
    Ü: "u",
    ü: "u",
    Ö: "o",
    ö: "o",
    Ç: "c",
    ç: "c",
  };
  return map[char] ?? char.toLocaleLowerCase("tr-TR");
}

export function normalizeWishText(text) {
  return Array.from(text)
    .map(foldTurkishChar)
    .join("")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(normalized) {
  return normalized.split(" ").filter(Boolean);
}

export function classifyRequest(rawText) {
  const normalized = normalizeWishText(rawText);
  const tokens = new Set(tokenize(normalized));
  const scores = {
    [SCENARIOS.KNOWLEDGE]: 0,
    [SCENARIOS.TREASURE]: 0,
    [SCENARIOS.ENCHANTED]: 0,
    [SCENARIOS.CHALLENGE]: 0,
  };

  const tokenList = [...tokens];
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (tokens.has(keyword)) {
        scores[category] += 2;
        continue;
      }
      if (keyword.length >= 4 && tokenList.some((token) => token.startsWith(keyword) || keyword.startsWith(token) && token.length >= 4)) {
        scores[category] += 2;
      }
    }
  }

  let best = SCENARIOS.DEFAULT;
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }

  return {
    scenario: best,
    scores,
    normalized,
  };
}
