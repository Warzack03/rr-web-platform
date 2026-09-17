import { Prisma } from "@prisma/client";

type SafeLogContextValue = string | number | bigint | boolean | null | undefined;

type SafeLogContext = Record<string, SafeLogContextValue>;

const sensitiveKeyPattern = /password|token|secret|credential|cookie|authorization|database_url|db_password/i;
const poolTimeoutPattern = /pool timeout: failed to retrieve a connection from pool/i;

declare global {
  var __buildDbPoolTimeoutLogged__: boolean | undefined;
}

function sanitizeContext(context: SafeLogContext = {}) {
  return Object.fromEntries(
    Object.entries(context)
      .filter(([key]) => !sensitiveKeyPattern.test(key))
      .map(([key, value]) => [
        key,
        typeof value === "bigint" ? value.toString() : value,
      ]),
  );
}

function getErrorSummary(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    name: "UnknownError",
    message: "Unknown server error",
  };
}

function getKnownDatabaseErrorMessage(error: Error) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  switch (error.code) {
    case "P2002":
      return "Ya existe un registro con esos datos.";
    case "P2025":
      return "El registro ya no esta disponible.";
    default:
      return null;
  }
}

export function logServerError(
  scope: string,
  error: unknown,
  context?: SafeLogContext,
) {
  if (
    process.env.NEXT_PHASE === "phase-production-build" &&
    error instanceof Error &&
    poolTimeoutPattern.test(error.message)
  ) {
    if (!global.__buildDbPoolTimeoutLogged__) {
      global.__buildDbPoolTimeoutLogged__ = true;
      console.warn(
        "[build-db] MySQL no estuvo disponible durante el prerender; se usaron los fallbacks publicos.",
      );
    }

    return;
  }

  console.error("[server-error]", {
    scope,
    ...getErrorSummary(error),
    context: sanitizeContext(context),
  });
}

export function getSafeServerErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message.trim();

  if (!message) {
    return fallback;
  }

  const knownDatabaseMessage = getKnownDatabaseErrorMessage(error);

  if (knownDatabaseMessage) {
    return knownDatabaseMessage;
  }

  if (/prisma|sql|database|connection|enoent|eacces|stack| at |\\|\/var\/|node_modules/i.test(message)) {
    return fallback;
  }

  return message;
}
