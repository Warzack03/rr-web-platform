type SafeLogContextValue = string | number | bigint | boolean | null | undefined;

type SafeLogContext = Record<string, SafeLogContextValue>;

const sensitiveKeyPattern = /password|token|secret|credential|cookie|authorization|database_url|db_password/i;

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

export function logServerError(
  scope: string,
  error: unknown,
  context?: SafeLogContext,
) {
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

  if (/prisma|sql|database|connection|enoent|eacces|stack| at |\\|\/var\/|node_modules/i.test(message)) {
    return fallback;
  }

  return message;
}
