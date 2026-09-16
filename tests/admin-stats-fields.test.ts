import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAdminStatFields,
  splitAdminStatFieldsForMobile,
} from "@/lib/admin/admin-stats";

describe("admin goalkeeper statistics", () => {
  it("allows goals and assists for first-team goalkeepers", () => {
    const fields = getAdminStatFields({
      isFirstTeam: true,
      isGoalkeeper: true,
    });

    assert.deepEqual(
      fields.slice(0, 2).map((field) => field.key),
      ["goals", "assists"],
    );
  });

  it("allows goals and assists for academy goalkeepers", () => {
    const fields = getAdminStatFields({
      isFirstTeam: false,
      isGoalkeeper: true,
    });
    const mobileFields = splitAdminStatFieldsForMobile(fields, true);

    assert.equal(fields.some((field) => field.key === "goals"), true);
    assert.equal(fields.some((field) => field.key === "assists"), true);
    assert.equal(
      mobileFields.primaryFields.some((field) => field.key === "goals"),
      true,
    );
    assert.equal(
      mobileFields.primaryFields.some((field) => field.key === "assists"),
      true,
    );
  });
});
