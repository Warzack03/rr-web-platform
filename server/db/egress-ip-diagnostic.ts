import { isIP } from "node:net";

const diagnosticVersion = 3;
const diagnosticUrl = "https://api.ipify.org?format=json";
const diagnosticTimeoutMs = 3_000;

type EgressIpDiagnosticResult =
  | {
      status: "IP_OK";
      sourceIp: string;
      durationMs: number;
    }
  | {
      status: "IP_ERROR";
      code: "HTTP_ERROR" | "INVALID_RESPONSE" | "LOOKUP_FAILED" | "TIMEOUT";
      durationMs: number;
    };

function getFailureCode(error: unknown) {
  if (error instanceof Error && error.name === "AbortError") {
    return "TIMEOUT" as const;
  }

  return "LOOKUP_FAILED" as const;
}

export async function logNodeEgressIpDiagnostic() {
  if (process.env.DB_IP_DIAGNOSTIC !== "true") {
    return;
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), diagnosticTimeoutMs);
  let result: EgressIpDiagnosticResult;

  try {
    const response = await fetch(diagnosticUrl, {
      cache: "no-store",
      headers: { accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      result = {
        status: "IP_ERROR",
        code: "HTTP_ERROR",
        durationMs: Date.now() - startedAt,
      };
    } else {
      const payload: unknown = await response.json();
      const sourceIp =
        payload &&
        typeof payload === "object" &&
        "ip" in payload &&
        typeof payload.ip === "string" &&
        isIP(payload.ip)
          ? payload.ip
          : null;

      result = sourceIp
        ? {
            status: "IP_OK",
            sourceIp,
            durationMs: Date.now() - startedAt,
          }
        : {
            status: "IP_ERROR",
            code: "INVALID_RESPONSE",
            durationMs: Date.now() - startedAt,
          };
    }
  } catch (error) {
    result = {
      status: "IP_ERROR",
      code: getFailureCode(error),
      durationMs: Date.now() - startedAt,
    };
  } finally {
    clearTimeout(timeout);
  }

  console.info("[node-egress-ip-diagnostic]", {
    diagnosticVersion,
    ...result,
  });
}
