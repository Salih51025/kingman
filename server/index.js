import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { buildBattlePlan } from "../shared/battlePlan.js";
import { MAX_REQUEST_LENGTH } from "../shared/validateRequest.js";
import { publicWishPayload, sanitizeWishRecord } from "../shared/wishRecord.js";
import { clearSessionCookie, createSessionCookie, passwordMatches, requireAdmin } from "./auth.js";
import { createWishStore } from "./wishStore.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

function loadLocalEnv() {
  const envPath = resolve(ROOT, ".env");
  if (!existsSync(envPath)) {
    return;
  }
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) {
      continue;
    }
    const index = line.indexOf("=");
    if (index === -1) {
      continue;
    }
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (key && process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const PORT = Number(process.env.PORT) || 8787;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const STORE_PATH = process.env.WISH_STORE_PATH || resolve(ROOT, "data", "wishes.json");
const SECURE_COOKIE = process.env.COOKIE_SECURE === "true";
const store = createWishStore(STORE_PATH);
const buckets = new Map();

function allowOrigin(origin) {
  if (CORS_ORIGIN === "*") {
    return true;
  }
  return CORS_ORIGIN.split(",").map((value) => value.trim()).includes(origin);
}

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const current = buckets.get(key) || { count: 0, reset: now + windowMs };
  if (now > current.reset) {
    current.count = 0;
    current.reset = now + windowMs;
  }
  current.count += 1;
  buckets.set(key, current);
  return current.count <= limit;
}

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "8kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "wish-battle", wishes: Boolean(ADMIN_PASSWORD && SESSION_SECRET) });
});

app.post("/api/battle/resolve", (req, res) => {
  const requestText = req.body?.request;
  if (typeof requestText === "string" && requestText.length > MAX_REQUEST_LENGTH + 50) {
    res.status(400).json({ ok: false, errorCode: "tooLong", error: "Request is too long." });
    return;
  }

  const plan = buildBattlePlan(requestText);
  if (!plan.ok) {
    res.status(400).json({ ok: false, errorCode: plan.errorCode, error: plan.error });
    return;
  }

  res.json({
    ok: true,
    request: plan.request,
    scenario: plan.scenario,
    theme: plan.theme,
    monsters: plan.monsters,
    script: plan.script,
    ultimate: plan.ultimate,
    source: "server",
  });
});

app.post("/api/wishes", (req, res) => {
  if (!rateLimit(`wish:${req.ip}`, 20, 60_000)) {
    res.status(429).json({ ok: false, errorCode: "rateLimited" });
    return;
  }
  const sanitized = sanitizeWishRecord(req.body || {});
  if (!sanitized.ok) {
    res.status(400).json({ ok: false, errorCode: sanitized.errorCode, error: sanitized.error });
    return;
  }
  const saved = store.add(sanitized.record);
  res.status(201).json({ ok: true, id: saved.id });
});

app.post("/api/developer/login", (req, res) => {
  if (!ADMIN_PASSWORD || !SESSION_SECRET) {
    res.status(503).json({ ok: false, errorCode: "notConfigured" });
    return;
  }
  if (!rateLimit(`login:${req.ip}`, 8, 60_000)) {
    res.status(429).json({ ok: false, errorCode: "rateLimited" });
    return;
  }
  if (!passwordMatches(req.body?.password, ADMIN_PASSWORD)) {
    res.status(401).json({ ok: false, errorCode: "unauthorized" });
    return;
  }
  res.setHeader("Set-Cookie", createSessionCookie(SESSION_SECRET, SECURE_COOKIE));
  res.json({ ok: true });
});

app.post("/api/developer/logout", (req, res) => {
  res.setHeader("Set-Cookie", clearSessionCookie(SECURE_COOKIE));
  res.json({ ok: true });
});

app.get("/api/developer/session", (req, res) => {
  if (!requireAdmin(req, res, SESSION_SECRET)) {
    return;
  }
  res.json({ ok: true });
});

app.get("/api/developer/wishes", (req, res) => {
  if (!requireAdmin(req, res, SESSION_SECRET)) {
    return;
  }
  const page = store.list({
    offset: req.query.offset,
    limit: req.query.limit,
  });
  res.json({
    ok: true,
    total: page.total,
    items: page.items.map(publicWishPayload),
  });
});

app.delete("/api/developer/wishes/:id", (req, res) => {
  if (!requireAdmin(req, res, SESSION_SECRET)) {
    return;
  }
  if (req.headers["x-requested-with"] !== "wish-battle") {
    res.status(403).json({ ok: false, errorCode: "forbidden" });
    return;
  }
  const removed = store.remove(req.params.id);
  if (!removed) {
    res.status(404).json({ ok: false, errorCode: "notFound" });
    return;
  }
  res.json({ ok: true });
});

app.use((err, _req, res, _next) => {
  res.status(400).json({ ok: false, error: err.message || "Invalid request." });
});

app.listen(PORT, () => {
  console.log(`Wish Battle API listening on http://localhost:${PORT}`);
});
