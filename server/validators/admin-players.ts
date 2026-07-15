import { z } from "zod";

const mediaReferenceSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || value.startsWith("/") || /^https?:\/\//.test(value),
    "Introduce una ruta publica valida.",
  );

export const savePlayerProfileInputSchema = z.object({
  playerId: z.string().trim().min(1),
  publicName: z.string().trim().min(1, "Introduce un nombre publico."),
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio.")
    .regex(/^[a-z0-9-]+$/, "Usa minusculas, numeros y guiones."),
  country: z.string().trim().min(2).max(2),
  foot: z.enum(["Derecha", "Izquierda", "Ambas"]),
  visible: z.boolean(),
  active: z.boolean(),
  photoMediaId: z.string().trim().regex(/^\d+$/).optional().or(z.literal("")),
  photoUrl: mediaReferenceSchema.or(z.literal("")),
});

export type SavePlayerProfileInput = z.infer<typeof savePlayerProfileInputSchema>;
