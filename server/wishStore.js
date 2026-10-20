import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

export function createWishStore(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
  if (!existsSync(filePath)) {
    writeFileSync(filePath, "[]", "utf8");
  }

  function readAll() {
    try {
      const parsed = JSON.parse(readFileSync(filePath, "utf8"));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeAll(records) {
    writeFileSync(filePath, JSON.stringify(records, null, 2), "utf8");
  }

  return {
    add(fields) {
      const records = readAll();
      const record = {
        id: randomUUID(),
        text: fields.text,
        createdAt: new Date().toISOString(),
        scenario: fields.scenario ?? null,
        ultimate: Boolean(fields.ultimate),
      };
      records.push(record);
      writeAll(records);
      return record;
    },
    list({ offset = 0, limit = 20 } = {}) {
      const records = readAll().slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
      const start = Math.max(0, Number(offset) || 0);
      const size = Math.min(50, Math.max(1, Number(limit) || 20));
      return {
        total: records.length,
        items: records.slice(start, start + size),
      };
    },
    remove(id) {
      const records = readAll();
      const next = records.filter((record) => record.id !== id);
      if (next.length === records.length) {
        return false;
      }
      writeAll(next);
      return true;
    },
  };
}
