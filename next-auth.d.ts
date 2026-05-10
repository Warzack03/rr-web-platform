import type { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      username: string;
      active: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    role: UserRole;
    active: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    username?: string;
    active?: boolean;
  }
}
