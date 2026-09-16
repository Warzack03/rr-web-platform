import { PrismaClient } from "@prisma/client";
import { logNodeEgressIpDiagnostic } from "@/server/db/egress-ip-diagnostic";
import { createMariaDbAdapter } from "@/server/db/runtime-config";

declare global {
  var __prisma__: PrismaClient | undefined;
  var __dbIpDiagnosticStarted__: boolean | undefined;
}

if (
  process.env.DB_IP_DIAGNOSTIC === "true" &&
  !global.__dbIpDiagnosticStarted__
) {
  global.__dbIpDiagnosticStarted__ = true;
  void logNodeEgressIpDiagnostic();
}

function createPrismaClient() {
  return new PrismaClient({
    adapter: createMariaDbAdapter(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = global.__prisma__ ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = prisma;
}
