import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOpponentSlug,
  normalizeOpponentName,
} from "@/lib/admin/opponent-management";
import { buildVenueSlug } from "@/lib/admin/venue-management";
import {
  buildMadridDateTime,
  formatMadridDateInput,
  formatMadridTimeInput,
} from "@/lib/date-time/madrid";

describe("opponent catalog", () => {
  it("builds stable competition-scoped slugs from Spanish names", () => {
    assert.equal(buildOpponentSlug("  La Família FC  "), "la-familia-fc");
  });

  it("normalizes spacing and case for legacy name matching", () => {
    assert.equal(normalizeOpponentName("  Dammchester   United "), "dammchester united");
  });
});

describe("venue catalog", () => {
  it("builds stable slugs for courts with accented names", () => {
    assert.equal(
      buildVenueSlug("Sant Ignasi Sarrià · Pista 4"),
      "sant-ignasi-sarria-pista-4",
    );
  });
});

describe("Madrid match times", () => {
  it("stores summer and winter wall-clock times as UTC without changing their public value", () => {
    const summer = buildMadridDateTime("2026-09-14", "21:10");
    const winter = buildMadridDateTime("2027-02-08", "21:10");

    assert.equal(summer?.toISOString(), "2026-09-14T19:10:00.000Z");
    assert.equal(winter?.toISOString(), "2027-02-08T20:10:00.000Z");
    assert.equal(formatMadridDateInput(summer), "2026-09-14");
    assert.equal(formatMadridTimeInput(summer), "21:10");
    assert.equal(formatMadridTimeInput(winter), "21:10");
  });
});
