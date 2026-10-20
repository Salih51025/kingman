import { useId, useState } from "react";
import { MAX_REQUEST_LENGTH } from "../../shared/validateRequest.js";
import { useI18n } from "../i18n/LanguageContext.jsx";

export default function RequestForm({
  visible,
  disabled,
  errorCode,
  onSubmit,
  onReset,
  canReset,
  collapsed,
  onToggle,
}) {
  const id = useId();
  const { t } = useI18n();
  const [value, setValue] = useState("");

  if (!visible) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(value);
  }

  const error = errorCode
    ? t(`errors.${errorCode}`, { max: MAX_REQUEST_LENGTH })
    : "";

  return (
    <form
      className={`wish-form ${collapsed ? "is-collapsed" : "is-expanded"}`}
      onSubmit={handleSubmit}
    >
      {collapsed ? (
        <button
          type="button"
          className="wish-toggle"
          aria-expanded="false"
          aria-label={t("form.expand")}
          onClick={onToggle}
        >
          <span className="hamburger" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {t("form.menu")}
        </button>
      ) : (
        <>
          {onToggle ? (
            <button
              type="button"
              className="wish-toggle ghost-toggle"
              aria-expanded="true"
              aria-label={t("form.collapse")}
              onClick={onToggle}
            >
              <span className="hamburger" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          ) : null}
          <label htmlFor={id}>{t("form.label")}</label>
          <textarea
            id={id}
            name="wish"
            rows={3}
            maxLength={MAX_REQUEST_LENGTH}
            placeholder={t("form.placeholder")}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
          />
          <div className="form-row">
            <button type="submit" disabled={disabled}>
              {t("form.submit")}
            </button>
            {canReset ? (
              <button type="button" className="ghost" onClick={onReset} disabled={disabled}>
                {t("form.reset")}
              </button>
            ) : null}
          </div>
          <p className="hint">{t("form.count", { count: value.length, max: MAX_REQUEST_LENGTH })}</p>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
        </>
      )}
    </form>
  );
}
