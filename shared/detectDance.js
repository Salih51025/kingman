import { normalizeWishText } from "./classifyRequest.js";

export function hasDanceCommand(rawText) {
  const tokens = normalizeWishText(rawText).split(" ").filter(Boolean);
  return tokens.some(
    (token, index) => token === "dans" && /^(et|etmek|etsin|edin|eder|edelim)$/.test(tokens[index + 1] || ""),
  );
}
