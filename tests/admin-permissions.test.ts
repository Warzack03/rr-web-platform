import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAccessAdminSection,
  getAdminNavigation,
  type AdminSectionKey,
} from "@/server/auth/permissions";

describe("admin permissions", () => {
  it("keeps navigation limited to active MVP sections", () => {
    const sections = getAdminNavigation().map((item) => item.section);

    assert.deepEqual(sections, [
      "dashboard",
      "matches",
      "standings",
      "stats",
      "teams",
      "assignments",
      "players",
      "media",
      "news",
    ]);
  });

  it("allows active sections for the single functional admin role", () => {
    for (const item of getAdminNavigation()) {
      assert.equal(canAccessAdminSection("ADMIN", item.section), true);
    }
  });

  it("denies discarded admin sections even if legacy keys still exist", () => {
    const discardedSections: AdminSectionKey[] = [
      "seasons",
      "imports",
      "users",
      "settings",
    ];

    for (const section of discardedSections) {
      assert.equal(canAccessAdminSection("ADMIN", section), false);
    }
  });
});
