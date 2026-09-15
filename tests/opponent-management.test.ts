import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOpponentSlug,
  normalizeOpponentName,
} from "@/lib/admin/opponent-management";

describe("opponent catalog", () => {
  it("builds stable competition-scoped slugs from Spanish names", () => {
    assert.equal(buildOpponentSlug("  La Família FC  "), "la-familia-fc");
  });

  it("normalizes spacing and case for legacy name matching", () => {
    assert.equal(normalizeOpponentName("  Dammchester   United "), "dammchester united");
  });
});
