import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "wb_admin";
const MAX_AGE_MS = 8 * 60 * 60 * 1000;

function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1 ? [part, ""] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

export function passwordMatches(provided, expected) {
  if (!expected || typeof provided !== "string") {
    return false;
  }
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function createSessionCookie(secret, secure) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE_MS, n: randomBytes(8).toString("hex") })).toString("base64url");
  const token = `${payload}.${sign(payload, secret)}`;
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${Math.floor(MAX_AGE_MS / 1000)}`,
  ];
  if (secure) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function clearSessionCookie(secure) {
  const parts = [`${COOKIE_NAME}=`, "HttpOnly", "Path=/", "SameSite=Lax", "Max-Age=0"];
  if (secure) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function readSession(req, secret) {
  const token = parseCookies(req.headers.cookie || "")[COOKIE_NAME];
  if (!token || !secret) {
    return null;
  }
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }
  const expected = sign(payload, secret);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || Date.now() > data.exp) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function requireAdmin(req, res, secret) {
  if (!readSession(req, secret)) {
    res.status(401).json({ ok: false, errorCode: "unauthorized" });
    return false;
  }
  return true;
}
