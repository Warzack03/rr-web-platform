import { z } from "zod";

const standingRowInputSchema = z.object({
  id: z.string().min(1),
  teamName: z.string().trim().min(1).max(150),
  teamSlug: z.string().trim().min(1).max(160).optional(),
  crestSrc: z.string().trim().optional(),
  played: z.number().int().min(0),
  won: z.number().int().min(0),
  drawn: z.number().int().min(0),
  lost: z.number().int().min(0),
  sanctionPoints: z.number().int().min(0),
  goalsFor: z.number().int().min(0),
  goalsAgainst: z.number().int().min(0),
  isOwnTeam: z.boolean(),
});

export const saveStandingInputSchema = z.object({
  standingId: z.string().regex(/^\d+$/, "Clasificacion invalida."),
  rows: z.array(standingRowInputSchema).min(1, "La clasificacion necesita filas."),
});

export const createStandingInputSchema = z
  .object({
    selectionMode: z.enum(["team", "competition"]),
    teamSlug: z.string().trim().optional(),
    competition: z.string().trim().optional(),
  })
  .superRefine((value, context) => {
    if (value.selectionMode === "team" && !value.teamSlug) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona un equipo.",
        path: ["teamSlug"],
      });
    }

    if (value.selectionMode === "competition" && !value.competition) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona una competicion.",
        path: ["competition"],
      });
    }
  });

export type SaveStandingInput = z.infer<typeof saveStandingInputSchema>;
export type CreateStandingInput = z.infer<typeof createStandingInputSchema>;
