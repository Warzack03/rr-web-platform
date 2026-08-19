import net from "node:net";
import { getRuntimeDatabaseConfig } from "@/server/db/runtime-config";

type TcpDiagnosticResult = {
  status: "TCP_OK" | "TCP_TIMEOUT" | "TCP_ERROR";
  code?: string;
  durationMs: number;
};

export async function logDatabaseTcpDiagnostic() {
  if (process.env.DB_TCP_DIAGNOSTIC !== "true") {
    return;
  }

  const { host, port } = getRuntimeDatabaseConfig();
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
}
