import { z } from "zod";
import { externalHttpUrlSchema } from "@/server/validators/public-url";

export const saveMatchInputSchema = z.object({
  matchId: z.string().trim().optional(),
  teamSlug: z.string().trim().min(1, "Selecciona un equipo."),
  season: z.string().trim().min(1, "Selecciona una temporada."),
  competition: z.string().trim().min(1, "Selecciona una competicion."),
  matchday: z.string().trim().min(1, "Introduce la jornada."),
  opponentId: z.string().trim().regex(/^\d+$/, "Selecciona un rival del catalogo."),
  opponentName: z.string().trim().min(1, "Selecciona un rival."),
  isHome: z.boolean(),
  date: z.string(),
  time: z.string(),
  venue: z.string().trim().min(1, "Selecciona un campo."),
  status: z.enum(["pending", "live", "played"]),
  ownScore: z.number().int().min(0).nullable(),
  opponentScore: z.number().int().min(0).nullable(),
  highlightsUrl: externalHttpUrlSchema("Introduce una URL http o https valida.").or(z.literal("")),
});

export const saveOpponentInputSchema = z.object({
  opponentId: z.string().trim().regex(/^\d+$/).optional(),
  competitionId: z.string().trim().regex(/^\d+$/, "Selecciona una competicion."),
  name: z.string().trim().min(2, "Introduce el nombre del rival.").max(150),
  logoMediaId: z.string().trim().regex(/^\d+$/).or(z.literal("")),
  active: z.boolean(),
});

export const saveQuickResultInputSchema = z.object({
  matchId: z.string().trim().min(1),
  ownScore: z.number().int().min(0),
  opponentScore: z.number().int().min(0),
  date: z.string(),
});

export type SaveMatchInput = z.infer<typeof saveMatchInputSchema>;
export type SaveOpponentInput = z.infer<typeof saveOpponentInputSchema>;
export type SaveQuickResultInput = z.infer<typeof saveQuickResultInputSchema>;
