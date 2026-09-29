import { z } from "zod";

export const saveCompetitionInputSchema = z.object({
  competitionId: z.string().trim().regex(/^\d+$/).optional(),
  season: z.string().trim().min(1, "Selecciona una temporada."),
  name: z.string().trim().min(2, "Introduce el nombre de la competicion.").max(150),
  organizer: z.string().trim().max(100).optional().default(""),
  groupName: z.string().trim().max(100).optional().default(""),
  active: z.boolean(),
});

export const toggleCompetitionInputSchema = z.object({
  competitionId: z.string().trim().regex(/^\d+$/),
});

export type SaveCompetitionInput = z.infer<typeof saveCompetitionInputSchema>;
export type ToggleCompetitionInput = z.infer<typeof toggleCompetitionInputSchema>;

