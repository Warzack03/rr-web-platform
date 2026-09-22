import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { z } from "zod";

const databaseUrlFallbackSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  user: z.string().min(1),
  password: z.string(),
  database: z.string().min(1),
  connectionLimit: z.number().int().positive(),
});

const defaultConnectionLimit = 2;

const runtimeDatabaseConfigSchema = z.object({
  host: z.string().min(1, "DB_HOST es obligatorio."),
  port: z.number().int().positive("DB_PORT debe ser un entero positivo."),
  user: z.string().min(1, "DB_USER es obligatorio."),
  password: z.string(),
  database: z.string().min(1, "DB_NAME es obligatorio."),
  connectionLimit: z
    .number()
    .int()
    .positive("DB_CONNECTION_LIMIT debe ser positivo.")
    .max(10, "DB_CONNECTION_LIMIT no debe superar 10 en Hostinger."),
});

export type RuntimeDatabaseConfig = z.infer<typeof runtimeDatabaseConfigSchema>;

const requiredRuntimeVariableNames = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
] as const;

export type RuntimeDatabaseConfigSource =
  | "DB_VARIABLES"
  | "DATABASE_URL"
  | "DATABASE_URL_WITH_PARTIAL_DB_VARIABLES_IGNORED"
  | "INCOMPLETE";

function getConfiguredRuntimeVariableCount() {
  return requiredRuntimeVariableNames.filter(
    (key) => process.env[key] !== undefined,
  ).length;
}

export function getRuntimeDatabaseConfigSource(): RuntimeDatabaseConfigSource {
  const configuredCount = getConfiguredRuntimeVariableCount();

  if (configuredCount === requiredRuntimeVariableNames.length) {
    return "DB_VARIABLES";
  }

  if (process.env.DATABASE_URL) {
    return configuredCount === 0
      ? "DATABASE_URL"
      : "DATABASE_URL_WITH_PARTIAL_DB_VARIABLES_IGNORED";
  }

  return "INCOMPLETE";
}

function normalizeNonSecretValue(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();
  const quote = trimmedValue[0];

  if (
    trimmedValue.length >= 2 &&
    (quote === '"' || quote === "'") &&
    trimmedValue.at(-1) === quote
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function parseConnectionLimit(
  value: string | undefined,
  fallback = defaultConnectionLimit,
) {
  return Math.min(parsePositiveInteger(value, fallback), 10);
}

function resolveConnectionLimit(
  value: string | undefined,
  fallback = defaultConnectionLimit,
) {
  const configuredLimit = parseConnectionLimit(value, fallback);

  // Next.js uses several isolated workers while prerendering. Keeping one
  // connection per worker prevents a build from exhausting Hostinger's shared
  // MySQL connection allowance while preserving the normal runtime pool.
  return process.env.NEXT_PHASE === "phase-production-build"
    ? 1
    : configuredLimit;
}

function getDatabaseUrlFallback() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  const parsedUrl = new URL(databaseUrl);

  return databaseUrlFallbackSchema.parse({
    host: parsedUrl.hostname,
    port: parsedUrl.port ? Number.parseInt(parsedUrl.port, 10) : 3306,
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace(/^\//, ""),
    connectionLimit: parseConnectionLimit(
      parsedUrl.searchParams.get("connection_limit") ?? undefined,
      defaultConnectionLimit,
    ),
  });
}

export function getRuntimeDatabaseConfig(): RuntimeDatabaseConfig {
  const fallback = getDatabaseUrlFallback();
  const useSeparateVariables =
    getRuntimeDatabaseConfigSource() === "DB_VARIABLES";

  return runtimeDatabaseConfigSchema.parse({
    host: normalizeNonSecretValue(
      useSeparateVariables ? process.env.DB_HOST : fallback?.host,
    ),
    port: useSeparateVariables
      ? parsePositiveInteger(process.env.DB_PORT, 3306)
      : (fallback?.port ?? 3306),
    user: normalizeNonSecretValue(
      useSeparateVariables ? process.env.DB_USER : fallback?.user,
    ),
    password: useSeparateVariables
      ? (process.env.DB_PASSWORD ?? "")
      : (fallback?.password ?? ""),
    database: normalizeNonSecretValue(
      useSeparateVariables ? process.env.DB_NAME : fallback?.database,
    ),
    connectionLimit: resolveConnectionLimit(
      useSeparateVariables ? process.env.DB_CONNECTION_LIMIT : undefined,
      useSeparateVariables
        ? defaultConnectionLimit
        : (fallback?.connectionLimit ?? defaultConnectionLimit),
    ),
  });
}

export function getMariaDbAdapterConfig() {
  const { host, port, user, password, database, connectionLimit } =
    getRuntimeDatabaseConfig();

  return {
    host,
    port,
    user,
    password,
    database,
    connectionLimit,
    connectTimeout: 5_000,
    acquireTimeout: 10_000,
    // Finish pool initialization first so its concrete driver error is not
    // hidden by the later generic acquire timeout.
    initializationTimeout: 8_000,
    idleTimeout: 300,
    // Local MySQL 8 commonly uses caching_sha2_password. The local connector
    // needs this opt-in to retrieve its public key when TLS is not configured.
    // Production keeps its existing authentication/TLS behaviour unchanged.
    allowPublicKeyRetrieval: process.env.NODE_ENV === "development",
  };
}

export function createMariaDbAdapter() {
  return new PrismaMariaDb(getMariaDbAdapterConfig());
}
