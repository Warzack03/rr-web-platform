import { z } from "zod";

export const saveMatchInputSchema = z.object({
  matchId: z.string().trim().optional(),
  teamSlug: z.string().trim().min(1, "Selecciona un equipo."),
  season: z.string().trim().min(1, "Selecciona una temporada."),
  competition: z.string().trim().min(1, "Selecciona una competicion."),
  matchday: z.string().trim().min(1, "Introduce la jornada."),
  opponentName: z.string().trim().min(1, "Selecciona un rival."),
  isHome: z.boolean(),
  date: z.string(),
  time: z.string(),
  venue: z.string().trim().min(1, "Selecciona un campo."),
  status: z.enum(["pending", "live", "played"]),
  ownScore: z.number().int().min(0).nullable(),
  opponentScore: z.number().int().min(0).nullable(),
  highlightsUrl: z.string().trim().url("Introduce una URL valida.").or(z.literal("")),
});

export const saveQuickResultInputSchema = z.object({
  matchId: z.string().trim().min(1),
  ownScore: z.number().int().min(0),
  opponentScore: z.number().int().min(0),
  date: z.string(),
});

export type SaveMatchInput = z.infer<typeof saveMatchInputSchema>;
export type SaveQuickResultInput = z.infer<typeof saveQuickResultInputSchema>;
