import { isIP } from "node:net";
import * as mariadb from "mariadb";
import type { ConnectionConfig } from "mariadb";
import {
  getRuntimeDatabaseConfig,
  getRuntimeDatabaseConfigSource,
} from "@/server/db/runtime-config";

type DiagnosticConnection = {
  query(sql: string): Promise<unknown>;
  end(): Promise<void>;
};
type DiagnosticConnectionFactory = (
  config: ConnectionConfig,
) => Promise<DiagnosticConnection>;

type DriverError = Error & {
  code?: string;
  errno?: number;
  sqlState?: string;
};

const diagnosticVersion = 1;
const diagnosticTimeoutMs = 5_000;

function getHostKind(host: string) {
  if (host === "localhost") {
    return "LOCALHOST" as const;
  }

  if (host === "127.0.0.1" || host === "::1") {
    return "LOOPBACK" as const;
  }

  return isIP(host) ? ("IP" as const) : ("HOSTNAME" as const);
}

function classifyConnectionError(error: DriverError) {
  if (error.errno === 1045 || error.code === "ER_ACCESS_DENIED_ERROR") {
    return "ACCESS_DENIED" as const;
  }

  if (error.errno === 1049 || error.code === "ER_BAD_DB_ERROR") {
    return "DATABASE_NOT_FOUND" as const;
  }

  switch (error.code) {
    case "ENOTFOUND":
    case "EAI_AGAIN":
      return "DNS_ERROR" as const;
    case "ECONNREFUSED":
      return "CONNECTION_REFUSED" as const;
    case "ETIMEDOUT":
      return "CONNECTION_TIMEOUT" as const;
    case "EHOSTUNREACH":
    case "ENETUNREACH":
      return "HOST_UNREACHABLE" as const;
    default:
      return "DRIVER_ERROR" as const;
  }
}

export async function logDatabaseConnectionDiagnostic(
  createConnection: DiagnosticConnectionFactory = mariadb.createConnection,
) {
  const startedAt = Date.now();

  try {
    const config = getRuntimeDatabaseConfig();
    const connection = await createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectTimeout: diagnosticTimeoutMs,
      socketTimeout: diagnosticTimeoutMs,
      prepareCacheLength: 0,
    });

    try {
      await connection.query("SELECT 1");
      console.info("[db-connection-diagnostic]", {
        diagnosticVersion,
        status: "DIRECT_CONNECTION_OK",
        configSource: getRuntimeDatabaseConfigSource(),
        hostKind: getHostKind(config.host),
        port: config.port,
        durationMs: Date.now() - startedAt,
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    const driverError: DriverError =
      error instanceof Error ? (error as DriverError) : new Error();

    console.error("[db-connection-diagnostic]", {
      diagnosticVersion,
      status: "DIRECT_CONNECTION_ERROR",
      reason: classifyConnectionError(driverError),
      driverCode: driverError.code ?? null,
      driverErrno: driverError.errno ?? null,
      sqlState: driverError.sqlState ?? null,
      configSource: getRuntimeDatabaseConfigSource(),
      durationMs: Date.now() - startedAt,
    });
  }
}
