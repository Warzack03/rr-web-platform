import { z } from "zod";
import { teamCoachRoleOptions } from "@/lib/admin/team-management-mocks";

const coachInputSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1, "Cada entrenador necesita nombre."),
  roleLabel: z.enum(teamCoachRoleOptions),
  publicVisible: z.boolean(),
});

export const saveTeamInputSchema = z.object({
  seasonTeamId: z.string().trim().optional(),
  name: z.string().trim().min(1, "Introduce un nombre."),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio.")
    .regex(/^[a-z0-9-]+$/, "Usa minusculas, numeros y guiones."),
  category: z.string().trim().min(1, "Selecciona una categoria."),
  competition: z.string().trim().min(1, "Selecciona una competicion."),
  season: z.string().trim().min(1, "Selecciona una temporada."),
  publicVisible: z.boolean(),
  active: z.boolean(),
  isFirstTeam: z.boolean(),
  displayOrder: z.number().int().min(0, "El orden no puede ser negativo."),
  coaches: z.array(coachInputSchema).min(1, "Anade al menos un entrenador."),
  logoUrl: z.string().trim().url("Introduce una URL valida para el logo.").or(z.literal("")),
  bannerUrl: z.string().trim().url("Introduce una URL valida para el banner.").or(z.literal("")),
});

export const toggleTeamInputSchema = z.object({
  seasonTeamId: z.string().trim().min(1),
});

export type SaveTeamInput = z.infer<typeof saveTeamInputSchema>;
export type ToggleTeamInput = z.infer<typeof toggleTeamInputSchema>;
