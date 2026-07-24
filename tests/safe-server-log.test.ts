import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Prisma } from "@prisma/client";
import { getSafeServerErrorMessage } from "@/server/logging/safe-server-log";

describe("safe server error messages", () => {
  it("normalizes known Prisma conflict errors", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed on the fields: (`slug`)",
      {
        code: "P2002",
        clientVersion: "test",
        meta: {
          target: ["slug"],
        },
      },
    );

    assert.equal(
      getSafeServerErrorMessage(error, "No hemos podido guardar."),
      "Ya existe un registro con esos datos.",
    );
  });

  it("hides internal database and stack-like messages", () => {
    assert.equal(
      getSafeServerErrorMessage(
        new Error("PrismaClientKnownRequestError: database connection failed"),
        "No hemos podido guardar.",
      ),
      "No hemos podido guardar.",
    );
  });

  it("keeps safe domain messages", () => {
    assert.equal(
      getSafeServerErrorMessage(
        new Error("Ese jugador ya tiene dos equipos activos en la temporada."),
        "No hemos podido guardar.",
      ),
      "Ese jugador ya tiene dos equipos activos en la temporada.",
    );
  });
});
