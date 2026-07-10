import { z } from "zod";

const dateInputSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Usa una fecha valida.")
  .or(z.literal(""));

const baseAssignmentSchema = z.object({
  shirtNumber: z.number().int().min(0).max(99),
  publicPosition: z.enum(["POR", "DEF", "MED", "DEL", "BAN"]),
  captain: z.boolean(),
  active: z.boolean(),
  joinedAt: dateInputSchema,
  leftAt: dateInputSchema,
});

export const saveAssignmentInputSchema = baseAssignmentSchema.extend({
  assignmentId: z.string().trim().min(1),
});

export const createAssignmentInputSchema = z
  .object({
    teamSlug: z.string().trim().min(1),
    mode: z.enum(["existing", "new"]),
    playerId: z.string().trim().optional().default(""),
    publicName: z.string().trim().optional().default(""),
    keepCurrentTeamsActive: z.boolean().default(false),
    shirtNumber: z.number().int().min(0).max(99),
    publicPosition: z.enum(["POR", "DEF", "MED", "DEL", "BAN"]),
    captain: z.boolean(),
    joinedAt: dateInputSchema,
  })
  .superRefine((value, ctx) => {
    if (value.mode === "existing" && !value.playerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["playerId"],
        message: "Selecciona un jugador existente.",
      });
    }

    if (value.mode === "new" && !value.publicName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publicName"],
        message: "Introduce el nombre publico del jugador.",
      });
    }
  });

export type SaveAssignmentInput = z.infer<typeof saveAssignmentInputSchema>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentInputSchema>;
