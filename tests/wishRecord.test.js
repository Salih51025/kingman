import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { publicWishPayload, sanitizeWishRecord } from "../shared/wishRecord.js";
import { createWishStore } from "../server/wishStore.js";
import { passwordMatches } from "../server/auth.js";

test("wish records keep only allowed fields and valid scenario IDs", () => {
  const bad = sanitizeWishRecord({ text: "  ", scenario: "hacked" });
  assert.equal(bad.ok, false);
  const good = sanitizeWishRecord({
    text: "okul sınavı",
    scenario: "knowledge",
    ultimate: true,
    extra: "drop me",
  });
  assert.equal(good.ok, true);
  assert.deepEqual(good.record, {
    text: "okul sınavı",
    scenario: "knowledge",
    ultimate: true,
  });
  assert.equal(sanitizeWishRecord({ text: "hello", scenario: "unknown" }).record.scenario, null);
});

test("public payload never exposes extra private fields", () => {
  const view = publicWishPayload({
    id: "abc",
    text: "canım",
    createdAt: "2026-01-01T00:00:00.000Z",
    scenario: "default",
    ultimate: true,
    ip: "1.2.3.4",
  });
  assert.deepEqual(view, {
    id: "abc",
    text: "canım",
    createdAt: "2026-01-01T00:00:00.000Z",
    scenario: "default",
    ultimate: true,
  });
  assert.equal("ip" in view, false);
});

test("file-backed store lists newest wishes first and paginates", () => {
  const file = join(mkdtempSync(join(tmpdir(), "wishes-")), "wishes.json");
  const store = createWishStore(file);
  store.add({ text: "first", scenario: "knowledge", ultimate: false });
  store.add({ text: "second", scenario: "treasure", ultimate: false });
  const page = store.list({ offset: 0, limit: 1 });
  assert.equal(page.total, 2);
  assert.equal(page.items.length, 1);
  assert.equal(page.items[0].text, "second");
  assert.equal(store.remove(page.items[0].id), true);
  assert.equal(store.list().total, 1);
});

test("admin password compare is exact and rejects empty secrets", () => {
  assert.equal(passwordMatches("secret", "secret"), true);
  assert.equal(passwordMatches("secret", "Secret"), false);
  assert.equal(passwordMatches("secret", ""), false);
});
