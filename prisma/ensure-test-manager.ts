import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, UserRole } from "@prisma/client";
import { getRuntimeDatabaseConfig } from "../server/db/runtime-config";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(getRuntimeDatabaseConfig()),
});

const testManager = {
  email: "risingraimon@risingraimon.local",
  username: "risingraimon",
  displayName: "Manager Pruebas",
  password: "risingraimon",
};


function canCreateTestManager() {
  return process.env.ENABLE_TEST_MANAGER === "true" || process.env.NODE_ENV !== "production";
}

async function main() {
  if (!canCreateTestManager()) {
    throw new Error(
      "Refusing to create the test manager in production without ENABLE_TEST_MANAGER=true.",
    );
  }

  const passwordHash = await bcrypt.hash(testManager.password, 10);

  const user = await prisma.user.upsert({
    where: {
      username: testManager.username,
    },
    update: {
      email: testManager.email,
      passwordHash,
      displayName: testManager.displayName,
      role: UserRole.MANAGER,
      active: true,
    },
    create: {
      email: testManager.email,
      username: testManager.username,
      passwordHash,
      displayName: testManager.displayName,
      role: UserRole.MANAGER,
      active: true,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      active: true,
    },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        user: {
          ...user,
          id: user.id.toString(),
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error("[ensure-test-manager] Failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
