import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";

import nextConfig from "../next.config";
import { sanitizeAdminCallbackUrl } from "@/lib/admin/login-callback";

async function findFiles(root: string, fileName: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const matches: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      matches.push(...await findFiles(entryPath, fileName));
      continue;
    }

    if (entry.name === fileName) {
      matches.push(entryPath);
    }
  }

  return matches;
}

describe("operational security", () => {
  it("keeps admin login callback URLs scoped to local admin routes", () => {
    assert.equal(sanitizeAdminCallbackUrl(undefined), "/admin");
    assert.equal(sanitizeAdminCallbackUrl("/admin/noticias?status=PUBLISHED"), "/admin/noticias?status=PUBLISHED");
    assert.equal(sanitizeAdminCallbackUrl("/equipos"), "/admin");
    assert.equal(sanitizeAdminCallbackUrl("https://evil.example/admin"), "/admin");
    assert.equal(sanitizeAdminCallbackUrl("//evil.example/admin"), "/admin");
    assert.equal(sanitizeAdminCallbackUrl("/admin\\evil"), "/admin");
  });

  it("defines security headers and no-store cache for admin/API routes", async () => {
    const headers = await nextConfig.headers?.();

    assert.ok(headers);

    const allRoutes = headers.find((entry) => entry.source === "/:path*");
    const adminRoutes = headers.find((entry) => entry.source === "/admin/:path*");
    const apiRoutes = headers.find((entry) => entry.source === "/api/:path*");

    assert.ok(allRoutes);
    assert.ok(adminRoutes);
    assert.ok(apiRoutes);

    assert.equal(
      allRoutes.headers.find((header) => header.key === "X-Content-Type-Options")?.value,
      "nosniff",
    );
    assert.equal(
      allRoutes.headers.find((header) => header.key === "X-Frame-Options")?.value,
      "DENY",
    );
    assert.equal(
      adminRoutes.headers.find((header) => header.key === "Cache-Control")?.value,
      "no-store, max-age=0",
    );
    assert.equal(
      apiRoutes.headers.find((header) => header.key === "Cache-Control")?.value,
      "no-store, max-age=0",
    );
  });

  it("keeps admin pages, actions and API routes behind server-side auth guards", async () => {
    const adminRoot = path.resolve(process.cwd(), "src", "app", "admin", "(panel)");
    const adminFiles = [
      ...await findFiles(adminRoot, "page.tsx"),
      ...await findFiles(adminRoot, "actions.ts"),
      path.resolve(process.cwd(), "src", "app", "api", "admin", "media", "route.ts"),
    ];

    for (const filePath of adminFiles) {
      const content = await readFile(filePath, "utf8");

      assert.match(
        content,
        /requireAuthenticatedAdmin|requireAdminSectionAccess|getAuthenticatedAdmin/,
        `${path.relative(process.cwd(), filePath)} debe validar sesion/permisos en servidor`,
      );
    }
  });
});
