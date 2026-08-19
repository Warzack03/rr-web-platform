import net from "node:net";
import * as mariadb from "mariadb";
import type { Connection } from "mariadb";
import { getRuntimeDatabaseConfig } from "@/server/db/runtime-config";

type TcpDiagnosticResult = {
  status: "TCP_OK" | "TCP_TIMEOUT" | "TCP_ERROR";
  code?: string;
  durationMs: number;
};

type DatabaseDiagnosticResult = {
  status: "DB_OK" | "DB_ERROR";
  code?: string;
  sqlState?: string;
  errno?: number;
  durationMs: number;
};

function getDatabaseErrorMetadata(error: unknown) {
  if (!error || typeof error !== "object") {
    return {};
  }

  const candidate = error as Record<string, unknown>;

  return {
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    sqlState:
      typeof candidate.sqlState === "string" ? candidate.sqlState : undefined,
    errno: typeof candidate.errno === "number" ? candidate.errno : undefined,
  };
}

export async function logDatabaseTcpDiagnostic() {
  if (process.env.DB_TCP_DIAGNOSTIC !== "true") {
    return;
  }

  const { host, port, user, password, database } = getRuntimeDatabaseConfig();
  const startedAt = Date.now();

  const result = await new Promise<TcpDiagnosticResult>((resolve) => {
    const socket = net.createConnection({ host, port });
    let settled = false;

    const finish = (
      status: TcpDiagnosticResult["status"],
      code?: string,
    ) => {
      if (settled) {
        return;
      }

      settled = true;
      socket.destroy();
      resolve({ status, code, durationMs: Date.now() - startedAt });
    };

    socket.setTimeout(5_000);
    socket.once("connect", () => finish("TCP_OK"));
    socket.once("timeout", () => finish("TCP_TIMEOUT"));
    socket.once("error", (error: NodeJS.ErrnoException) =>
      finish("TCP_ERROR", error.code),
    );
  });

  console.info("[db-tcp-diagnostic]", result);

  if (result.status !== "TCP_OK") {
    return;
  }

  const databaseStartedAt = Date.now();
  let connection: Connection | undefined;
  let databaseResult: DatabaseDiagnosticResult;

  try {
    const establishedConnection = await mariadb.createConnection({
      host,
      port,
      user,
      password,
      database,
      connectTimeout: 5_000,
      socketTimeout: 5_000,
    });
    connection = establishedConnection;
    await establishedConnection.query("SELECT 1");
    databaseResult = {
      status: "DB_OK",
      durationMs: Date.now() - databaseStartedAt,
    };
  } catch (error) {
    databaseResult = {
      status: "DB_ERROR",
      ...getDatabaseErrorMetadata(error),
      durationMs: Date.now() - databaseStartedAt,
    };
  } finally {
    await connection?.end().catch(() => undefined);
  }

  console.info("[db-connection-diagnostic]", databaseResult);
}
