import { useEffect, useState } from "react";
import { useI18n } from "../i18n/LanguageContext.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";
import {
  deleteDeveloperWish,
  developerLogin,
  developerLogout,
  developerSession,
  hasWishApi,
  listDeveloperWishes,
} from "../api/wishClient.js";

const PAGE_SIZE = 20;

export default function DeveloperWishes() {
  const { t, lang } = useI18n();
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState(hasWishApi() ? "checking" : "noApi");
  const [errorCode, setErrorCode] = useState("");

  async function loadList(nextOffset = 0) {
    setStatus("loading");
    const result = await listDeveloperWishes({ offset: nextOffset, limit: PAGE_SIZE });
    if (!result.ok) {
      setAuthed(false);
      setStatus(result.errorCode === "unauthorized" ? "login" : "error");
      setErrorCode(result.errorCode || "unauthorized");
      return;
    }
    setAuthed(true);
    setItems(result.items || []);
    setTotal(result.total || 0);
    setOffset(nextOffset);
    setStatus("ready");
    setErrorCode("");
  }

  useEffect(() => {
    if (!hasWishApi()) {
      return;
    }
    developerSession().then((result) => {
      if (result.ok) {
        loadList(0);
      } else {
        setStatus(result.errorCode === "notConfigured" ? "notConfigured" : "login");
      }
    });
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    const result = await developerLogin(password);
    setPassword("");
    if (!result.ok) {
      setErrorCode(result.errorCode || "unauthorized");
      setStatus(result.errorCode === "notConfigured" ? "notConfigured" : "login");
      return;
    }
    await loadList(0);
  }

  async function handleLogout() {
    await developerLogout();
    setAuthed(false);
    setItems([]);
    setStatus("login");
  }

  async function handleDelete(id) {
    const result = await deleteDeveloperWish(id);
    if (result.ok) {
      await loadList(offset);
    }
  }

  const formatter = new Intl.DateTimeFormat(lang === "en" ? "en" : "tr", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="dev-panel">
      <LanguageToggle />
      <header className="dev-head">
        <p className="hud-kicker">{t("dev.kicker")}</p>
        <h1>{t("dev.title")}</h1>
        <p><a href="./">{t("dev.back")}</a></p>
      </header>

      {status === "noApi" || status === "notConfigured" ? (
        <p className="form-error" role="alert">{t(`dev.errors.${status === "noApi" ? "noApi" : "notConfigured"}`)}</p>
      ) : null}

      {status === "login" ? (
        <form className="wish-form is-expanded dev-login" onSubmit={handleLogin}>
          <label htmlFor="dev-pass">{t("dev.password")}</label>
          <input
            id="dev-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit">{t("dev.login")}</button>
          {errorCode ? <p className="form-error" role="alert">{t(`dev.errors.${errorCode}`)}</p> : null}
        </form>
      ) : null}

      {status === "checking" || status === "loading" ? <p>{t("dev.loading")}</p> : null}

      {authed && status === "ready" ? (
        <section>
          <div className="dev-toolbar">
            <p>{t("dev.count", { count: total })}</p>
            <button type="button" className="ghost" onClick={handleLogout}>{t("dev.logout")}</button>
          </div>
          {items.length === 0 ? <p>{t("dev.empty")}</p> : (
            <ol className="dev-list">
              {items.map((item) => (
                <li key={item.id}>
                  <p className="dev-wish">{item.text}</p>
                  <p className="hint">
                    {formatter.format(new Date(item.createdAt))}
                    {item.scenario ? ` · ${item.scenario}` : ""}
                    {item.ultimate ? ` · ${t("dev.ultimate")}` : ""}
                  </p>
                  <button type="button" className="ghost" onClick={() => handleDelete(item.id)}>
                    {t("dev.delete")}
                  </button>
                </li>
              ))}
            </ol>
          )}
          <div className="dev-pager">
            <button type="button" disabled={offset === 0} onClick={() => loadList(Math.max(0, offset - PAGE_SIZE))}>
              {t("dev.prev")}
            </button>
            <button type="button" disabled={offset + PAGE_SIZE >= total} onClick={() => loadList(offset + PAGE_SIZE)}>
              {t("dev.next")}
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
