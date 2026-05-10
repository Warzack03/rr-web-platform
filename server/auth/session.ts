import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/server/auth/config";
import { type AdminSectionKey, canAccessAdminSection } from "@/server/auth/permissions";
import { prisma } from "@/server/db/prisma";

export type AuthenticatedAdmin = {
  id: bigint;
  idString: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  active: boolean;
};

export async function getAuthenticatedAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  let userId: bigint;

  try {
    userId = BigInt(session.user.id);
  } catch {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      role: true,
      active: true,
    },
  });

  if (!user || !user.active) {
    return null;
  }

  return {
    ...user,
    idString: user.id.toString(),
  } satisfies AuthenticatedAdmin;
}

export async function requireAuthenticatedAdmin() {
  const user = await getAuthenticatedAdmin();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

export async function requireAdminSectionAccess(section: AdminSectionKey) {
  const user = await requireAuthenticatedAdmin();

  if (!canAccessAdminSection(user.role, section)) {
    redirect("/admin");
  }

  return user;
}
