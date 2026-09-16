import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { getRuntimeDatabaseConfig } from "@/server/db/runtime-config";

const originalNextPhase = process.env.NEXT_PHASE;
const originalConnectionLimit = process.env.DB_CONNECTION_LIMIT;

afterEach(() => {
  if (originalNextPhase === undefined) {
    delete process.env.NEXT_PHASE;
  } else {
    process.env.NEXT_PHASE = originalNextPhase;
  }

  if (originalConnectionLimit === undefined) {
    delete process.env.DB_CONNECTION_LIMIT;
  } else {
    process.env.DB_CONNECTION_LIMIT = originalConnectionLimit;
  }
});

describe("runtime database pool configuration", () => {
  it("keeps the configured pool limit during normal runtime", () => {
    delete process.env.NEXT_PHASE;
    process.env.DB_CONNECTION_LIMIT = "5";

    assert.equal(getRuntimeDatabaseConfig().connectionLimit, 5);
  });

  it("limits every Next.js build worker to one connection", () => {
    process.env.NEXT_PHASE = "phase-production-build";
    process.env.DB_CONNECTION_LIMIT = "5";

    assert.equal(getRuntimeDatabaseConfig().connectionLimit, 1);
  });
});
