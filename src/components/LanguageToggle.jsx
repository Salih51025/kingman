import { useI18n } from "../i18n/LanguageContext.jsx";

export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="lang-toggle" role="group" aria-label={t("lang.group")}>
      <button
        type="button"
        aria-pressed={lang === "tr"}
        aria-label={t("lang.tr")}
        onClick={() => setLang("tr")}
      >
        TR
      </button>
      <span aria-hidden="true">|</span>
      <button
        type="button"
        aria-pressed={lang === "en"}
        aria-label={t("lang.en")}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}
