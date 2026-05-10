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

const runtimeDatabaseConfigSchema = z.object({
  host: z.string().min(1, "DB_HOST es obligatorio."),
  port: z.number().int().positive("DB_PORT debe ser un entero positivo."),
  user: z.string().min(1, "DB_USER es obligatorio."),
  password: z.string(),
  database: z.string().min(1, "DB_NAME es obligatorio."),
  connectionLimit: z.number().int().positive("DB_CONNECTION_LIMIT debe ser positivo."),
});

export type RuntimeDatabaseConfig = z.infer<typeof runtimeDatabaseConfigSchema>;

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
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
    connectionLimit: parsePositiveInteger(parsedUrl.searchParams.get("connection_limit") ?? undefined, 5),
  });
}

export function getRuntimeDatabaseConfig(): RuntimeDatabaseConfig {
  const fallback = getDatabaseUrlFallback();

  return runtimeDatabaseConfigSchema.parse({
    host: process.env.DB_HOST ?? fallback?.host,
    port: parsePositiveInteger(process.env.DB_PORT, fallback?.port ?? 3306),
    user: process.env.DB_USER ?? fallback?.user,
    password: process.env.DB_PASSWORD ?? fallback?.password ?? "",
    database: process.env.DB_NAME ?? fallback?.database,
    connectionLimit: parsePositiveInteger(
      process.env.DB_CONNECTION_LIMIT,
      fallback?.connectionLimit ?? 5,
    ),
  });
}

export function createMariaDbAdapter() {
  const { host, port, user, password, database, connectionLimit } =
    getRuntimeDatabaseConfig();

  return new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit,
  });
}
