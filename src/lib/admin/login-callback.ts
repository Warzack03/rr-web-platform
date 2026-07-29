const DEFAULT_ADMIN_CALLBACK_URL = "/admin";

export function sanitizeAdminCallbackUrl(value: string | undefined) {
  if (!value) {
    return DEFAULT_ADMIN_CALLBACK_URL;
  }

  if (!value.startsWith("/admin")) {
    return DEFAULT_ADMIN_CALLBACK_URL;
  }

  if (value.startsWith("//") || value.includes("\\") || value.includes("\n") || value.includes("\r")) {
    return DEFAULT_ADMIN_CALLBACK_URL;
  }

  try {
    const parsedUrl = new URL(value, "https://risingraimon.local");

    if (parsedUrl.origin !== "https://risingraimon.local") {
      return DEFAULT_ADMIN_CALLBACK_URL;
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return DEFAULT_ADMIN_CALLBACK_URL;
  }
}
