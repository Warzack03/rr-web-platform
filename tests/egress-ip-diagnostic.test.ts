import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { logNodeEgressIpDiagnostic } from "@/server/db/egress-ip-diagnostic";

const originalFetch = globalThis.fetch;
const originalConsoleInfo = console.info;
const originalDiagnosticFlag = process.env.DB_IP_DIAGNOSTIC;

afterEach(() => {
  globalThis.fetch = originalFetch;
  console.info = originalConsoleInfo;

  if (originalDiagnosticFlag === undefined) {
    delete process.env.DB_IP_DIAGNOSTIC;
  } else {
    process.env.DB_IP_DIAGNOSTIC = originalDiagnosticFlag;
  }
});

describe("Node egress IP diagnostic", () => {
  it("does nothing unless the production diagnostic is explicitly enabled", async () => {
    delete process.env.DB_IP_DIAGNOSTIC;
    let requested = false;
    globalThis.fetch = (async () => {
      requested = true;
      throw new Error("Unexpected request");
    }) as typeof fetch;

    await logNodeEgressIpDiagnostic();

    assert.equal(requested, false);
  });

  it("logs a validated public source IP without database credentials", async () => {
    process.env.DB_IP_DIAGNOSTIC = "true";
    const logEntries: unknown[][] = [];
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ ip: "203.0.113.10" }), {
        headers: { "content-type": "application/json" },
        status: 200,
      })) as typeof fetch;
    console.info = (...args: unknown[]) => logEntries.push(args);

    await logNodeEgressIpDiagnostic();

    assert.equal(logEntries.length, 1);
    assert.equal(logEntries[0]?.[0], "[node-egress-ip-diagnostic]");
    const result = logEntries[0]?.[1] as Record<string, unknown>;
    assert.equal(result.diagnosticVersion, 3);
    assert.equal(result.status, "IP_OK");
    assert.equal(result.sourceIp, "203.0.113.10");
    assert.equal(typeof result.durationMs, "number");
  });

  it("keeps lookup failures non-blocking and does not log error details", async () => {
    process.env.DB_IP_DIAGNOSTIC = "true";
    const logEntries: unknown[][] = [];
    globalThis.fetch = (async () => {
      throw new Error("DB_PASSWORD=must-not-appear");
    }) as typeof fetch;
    console.info = (...args: unknown[]) => logEntries.push(args);

    await logNodeEgressIpDiagnostic();

    assert.equal(logEntries.length, 1);
    const result = logEntries[0]?.[1] as Record<string, unknown>;
    assert.equal(result.diagnosticVersion, 3);
    assert.equal(result.status, "IP_ERROR");
    assert.equal(result.code, "LOOKUP_FAILED");
    assert.equal(typeof result.durationMs, "number");
    assert.doesNotMatch(JSON.stringify(logEntries), /must-not-appear/);
  });
});
