import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminLoginPath = "/admin/login";

function getAuthSecret() {
  return process.env.AUTH_SECRET ?? "rr-web-platform-dev-auth-secret";
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: getAuthSecret(),
  });

  const isAuthenticated = Boolean(token?.sub && token.active);
  const isLoginPage = pathname === adminLoginPath;

  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL(adminLoginPath, request.url);
    const callbackUrl = `${pathname}${search}`;

    if (pathname !== "/admin") {
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
    }

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
