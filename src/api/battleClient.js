import { buildBattlePlan } from "../../shared/battlePlan.js";

const API_URL = import.meta.env.VITE_API_URL || "";

export async function resolveBattle(request) {
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/api/battle/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request }),
      });
      const data = await response.json();
      if (data?.ok) {
        return data;
      }
    } catch {
      // Static GitHub Pages hosts have no Express server; use local rules.
    }
  }

  const local = buildBattlePlan(request);
  return { ...local, source: "local" };
}
