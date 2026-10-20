export const MAX_REQUEST_LENGTH = 300;

export function validateRequest(raw) {
  if (typeof raw !== "string") {
    return { ok: false, errorCode: "notText", error: "Request must be text." };
  }

  const text = raw.trim();
  if (!text) {
    return {
      ok: false,
      errorCode: "empty",
      error: "Please write a wish before sending.",
    };
  }

  if (text.length > MAX_REQUEST_LENGTH) {
    return {
      ok: false,
      errorCode: "tooLong",
      error: `Keep your wish to ${MAX_REQUEST_LENGTH} characters or fewer.`,
    };
  }

  return { ok: true, text };
}
