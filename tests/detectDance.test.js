import assert from "node:assert/strict";
import { test } from "node:test";
import { hasDanceCommand } from "../shared/detectDance.js";

test("recognizes the Turkish dance command regardless of case and punctuation", () => {
  assert.equal(hasDanceCommand("dans et"), true);
  assert.equal(hasDanceCommand("lutfen dans et!"), true);
  assert.equal(hasDanceCommand("DANS ETMEK"), true);
});

test("does not treat unrelated wishes as a dance command", () => {
  assert.equal(hasDanceCommand("dans etmek istiyorum"), true);
  assert.equal(hasDanceCommand("dans etkinlik"), false);
  assert.equal(hasDanceCommand("dans"), false);
  assert.equal(hasDanceCommand("bana yardim et"), false);
});
