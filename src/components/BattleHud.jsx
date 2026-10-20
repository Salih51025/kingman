import { useI18n } from "../i18n/LanguageContext.jsx";
import { formatLog, formatScenario } from "../i18n/formatBattle.js";

export default function BattleHud({ plan, logStep, complete }) {
  const { lang, t } = useI18n();

  if (!plan) {
    return null;
  }

  return (
    <aside className="battle-hud" aria-live="polite">
      <p className="hud-kicker">{t("hud.kicker")}</p>
      <h2>{formatScenario(lang, plan.scenario, "title")}</h2>
      <p className={complete ? "hud-result" : "hud-log"}>{formatLog(lang, logStep)}</p>
    </aside>
  );
}
