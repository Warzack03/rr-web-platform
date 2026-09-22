import "dotenv/config";
import { isIP } from "node:net";
import * as mariadb from "mariadb";

const diagnosticVersion = 2;
const timeoutMs = 5_000;
const requiredDbVariables = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

function normalizeNonSecretValue(value) {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();
  const quote = trimmedValue[0];

  return trimmedValue.length >= 2 && (quote === '"' || quote === "'") && trimmedValue.at(-1) === quote
    ? trimmedValue.slice(1, -1)
    : trimmedValue;
}

function getConfigSource() {
  const configuredCount = requiredDbVariables.filter(
    (key) => process.env[key] !== undefined,
  ).length;

  if (configuredCount === requiredDbVariables.length) {
    return "DB_VARIABLES";
  }

  if (process.env.DATABASE_URL) {
    return configuredCount === 0
      ? "DATABASE_URL"
      : "DATABASE_URL_WITH_PARTIAL_DB_VARIABLES_IGNORED";
  }

  return "INCOMPLETE";
}

function getConfig() {
  const configSource = getConfigSource();
  const useDbVariables = configSource === "DB_VARIABLES";
  const databaseUrl = useDbVariables ? null : process.env.DATABASE_URL;
  const parsedUrl = databaseUrl ? new URL(databaseUrl) : null;
  const host = normalizeNonSecretValue(
    useDbVariables ? process.env.DB_HOST : parsedUrl?.hostname,
  );
  const portValue = useDbVariables ? process.env.DB_PORT : parsedUrl?.port;
  const port = portValue ? Number.parseInt(portValue, 10) : 3306;
  const user = normalizeNonSecretValue(
    useDbVariables ? process.env.DB_USER : decodeURIComponent(parsedUrl?.username ?? ""),
  );
  const password = useDbVariables
    ? (process.env.DB_PASSWORD ?? "")
    : decodeURIComponent(parsedUrl?.password ?? "");
  const database = normalizeNonSecretValue(
    useDbVariables ? process.env.DB_NAME : parsedUrl?.pathname.replace(/^\//, ""),
  );

  if (!host || !user || !database || !Number.isInteger(port) || port <= 0) {
    const error = new Error("Database runtime configuration is incomplete.");
    error.code = "CONFIG_INVALID";
    throw error;
  }

  return { host, port, user, password, database };
}

function getHostKind(host) {
  if (host === "localhost") return "LOCALHOST";
  if (host === "127.0.0.1" || host === "::1") return "LOOPBACK";
  return isIP(host) ? "IP" : "HOSTNAME";
}

function classifyError(error) {
  if (error.code === "CONFIG_INVALID") return "CONFIG_INVALID";
  if (error.errno === 1226 || error.code === "ER_USER_LIMIT_REACHED") return "USER_CONNECTION_LIMIT";
  if (error.errno === 1203 || error.code === "ER_TOO_MANY_USER_CONNECTIONS") return "USER_CONNECTION_LIMIT";
  if (error.errno === 1040 || error.code === "ER_CON_COUNT_ERROR") return "SERVER_CONNECTION_LIMIT";
  if (error.errno === 1045 || error.code === "ER_ACCESS_DENIED_ERROR") return "ACCESS_DENIED";
  if (error.errno === 1049 || error.code === "ER_BAD_DB_ERROR") return "DATABASE_NOT_FOUND";
  if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") return "DNS_ERROR";
  if (error.code === "ECONNREFUSED") return "CONNECTION_REFUSED";
  if (error.code === "ETIMEDOUT") return "CONNECTION_TIMEOUT";
  if (error.code === "EHOSTUNREACH" || error.code === "ENETUNREACH") return "HOST_UNREACHABLE";
  return "DRIVER_ERROR";
}

async function main() {
  const startedAt = Date.now();

  try {
    const config = getConfig();
    const connection = await mariadb.createConnection({
      ...config,
      connectTimeout: timeoutMs,
      socketTimeout: timeoutMs,
      prepareCacheLength: 0,
    });

    try {
      await connection.query("SELECT 1");
      console.info("[db-deploy-connection]", {
        diagnosticVersion,
        status: "DIRECT_CONNECTION_OK",
        configSource: getConfigSource(),
        hostKind: getHostKind(config.host),
        port: config.port,
        durationMs: Date.now() - startedAt,
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("[db-deploy-connection]", {
      diagnosticVersion,
      status: "DIRECT_CONNECTION_ERROR",
      reason: classifyError(error),
      driverCode: error?.code ?? null,
      driverErrno: error?.errno ?? null,
      sqlState: error?.sqlState ?? null,
      configSource: getConfigSource(),
      durationMs: Date.now() - startedAt,
    });
  }
}

void main();
