import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { logNodeEgressIpDiagnostic } from "@/server/db/egress-ip-diagnostic";
import { adminLoginSchema } from "@/server/validators/auth";

function getAuthSecret() {
  if (process.env.AUTH_SECRET) {
    return process.env.AUTH_SECRET;
  }

  if (process.env.NODE_ENV !== "production") {
    return "rr-web-platform-dev-auth-secret";
  }

  throw new Error("Missing AUTH_SECRET environment variable.");
}

function getUseSecureCookies() {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  if (
    process.env.NEXT_PHASE !== "phase-production-build" &&
    !process.env.NEXTAUTH_URL?.startsWith("https://")
  ) {
    throw new Error("NEXTAUTH_URL must use https:// in production.");
  }

  return true;
}

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  useSecureCookies: getUseSecureCookies(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        login: { label: "Email o usuario", type: "text" },
        password: { label: "Contrasena", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = adminLoginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const login = parsedCredentials.data.login.toLowerCase();
        await logNodeEgressIpDiagnostic();

        const user = await prisma.user.findFirst({
          where: {
            active: true,
            OR: [{ email: login }, { username: login }],
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          parsedCredentials.data.password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.displayName,
          username: user.username,
          role: user.role,
          active: user.active,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as UserRole;
        token.username = user.username;
        token.active = user.active;
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/admin")) {
        return `${baseUrl}${url}`;
      }

      try {
        const parsedUrl = new URL(url);

        if (
          parsedUrl.origin === baseUrl &&
          parsedUrl.pathname.startsWith("/admin")
        ) {
          return url;
        }
      } catch {
        return `${baseUrl}/admin`;
      }

      return `${baseUrl}/admin`;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.username = token.username as string;
        session.user.active = Boolean(token.active);
      }

      return session;
    },
  },
};
