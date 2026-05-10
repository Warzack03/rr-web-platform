import { z } from "zod";

export const adminLoginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, "Introduce tu email o nombre de usuario.")
    .max(190, "El identificador es demasiado largo."),
  password: z
    .string()
    .min(8, "La contrasena debe tener al menos 8 caracteres.")
    .max(255, "La contrasena es demasiado larga."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
