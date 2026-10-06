import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { requiresSecondKitForAwayMatch } from "@/lib/public/kit-requirements";

describe("public calendar kit requirements", () => {
  it("requires the second kit away against yellow-kit opponents", () => {
    for (const opponentName of ["Senior C", "SENIORC", "Uranus F.C.", "Latan"]) {
      assert.equal(
        requiresSecondKitForAwayMatch({ isOwnTeamHome: false, opponentName }),
        true,
      );
    }
  });

  it("does not show the requirement at home against the same opponents", () => {
    assert.equal(
      requiresSecondKitForAwayMatch({ isOwnTeamHome: true, opponentName: "Uranus FC" }),
      false,
    );
  });

  it("does not show the requirement away against other opponents", () => {
    assert.equal(
      requiresSecondKitForAwayMatch({ isOwnTeamHome: false, opponentName: "Otro equipo" }),
      false,
    );
  });
});
