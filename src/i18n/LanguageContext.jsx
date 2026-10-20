import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translate } from "./translations.js";

const STORAGE_KEY = "wish-battle-lang";
const LanguageContext = createContext(null);

function readStoredLang() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "tr") {
      return saved;
    }
  } catch {
    // Private mode or blocked storage still gets the Turkish default.
  }
  return "tr";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore persistence failures.
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (path, params) => translate(lang, path, params),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
