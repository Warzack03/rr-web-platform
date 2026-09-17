import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { logDatabaseConnectionDiagnostic } from "@/server/db/connection-diagnostic";

const originalConsoleError = console.error;
const originalConsoleInfo = console.info;

afterEach(() => {
  console.error = originalConsoleError;
  console.info = originalConsoleInfo;
});

describe("database connection diagnostic", () => {
  it("reports a successful direct connection without exposing credentials", async () => {
    const entries: unknown[][] = [];
    console.info = (...args: unknown[]) => entries.push(args);

    await logDatabaseConnectionDiagnostic(async () => ({
      query: async () => [{ result: 1 }],
      end: async () => undefined,
    }));

    assert.equal(entries.length, 1);
    assert.equal(entries[0]?.[0], "[db-connection-diagnostic]");
    const result = entries[0]?.[1] as Record<string, unknown>;
    assert.equal(result.status, "DIRECT_CONNECTION_OK");
    assert.doesNotMatch(JSON.stringify(entries), /password/i);
  });

  it("classifies authentication errors without logging their message", async () => {
    const entries: unknown[][] = [];
    console.error = (...args: unknown[]) => entries.push(args);
    const authenticationError = Object.assign(
      new Error("Access denied for secret-user using password secret-value"),
      {
        code: "ER_ACCESS_DENIED_ERROR",
        errno: 1045,
        sqlState: "28000",
      },
    );

    await logDatabaseConnectionDiagnostic(async () => {
      throw authenticationError;
    });

    assert.equal(entries.length, 1);
    const result = entries[0]?.[1] as Record<string, unknown>;
    assert.equal(result.status, "DIRECT_CONNECTION_ERROR");
    assert.equal(result.reason, "ACCESS_DENIED");
    assert.equal(result.driverCode, "ER_ACCESS_DENIED_ERROR");
    assert.doesNotMatch(JSON.stringify(entries), /secret-user|secret-value/);
  });
});
