const CONTROL_CHARS_PATTERN = /[\u0000-\u001f\u007f]/;
const SVG_EXTENSION_PATTERN = /\.(svg|svgz)$/i;

export function isHttpOrHttpsUrl(value: string) {
  try {
    const parsedUrl = new URL(value);

    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export function isSafeExternalHttpUrl(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue || CONTROL_CHARS_PATTERN.test(normalizedValue)) {
    return false;
  }

  return isHttpOrHttpsUrl(normalizedValue);
}

export function isSafeLocalPublicPath(value: string) {
  const normalizedValue = value.trim();
  const rawPathSegments = (normalizedValue.split(/[?#]/, 1)[0] ?? "").split("/");

  if (
    !normalizedValue.startsWith("/") ||
    normalizedValue.startsWith("//") ||
    normalizedValue.includes("\\") ||
    rawPathSegments.some((segment) => segment === "." || segment === "..") ||
    CONTROL_CHARS_PATTERN.test(normalizedValue)
  ) {
    return false;
  }

  try {
    const parsedUrl = new URL(normalizedValue, "https://risingraimon.local");
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    return !pathSegments.some((segment) => segment === "." || segment === "..");
  } catch {
    return false;
  }
}

export function hasSvgExtension(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return false;
  }

  try {
    const parsedUrl = normalizedValue.startsWith("/")
      ? new URL(normalizedValue, "https://risingraimon.local")
      : new URL(normalizedValue);

    return SVG_EXTENSION_PATTERN.test(parsedUrl.pathname);
  } catch {
    const pathWithoutQuery = normalizedValue.split(/[?#]/, 1)[0] ?? "";

    return SVG_EXTENSION_PATTERN.test(pathWithoutQuery);
  }
}

export function isSafePublicImageReference(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue || hasSvgExtension(normalizedValue)) {
    return false;
  }

  return isSafeLocalPublicPath(normalizedValue) || isSafeExternalHttpUrl(normalizedValue);
}
