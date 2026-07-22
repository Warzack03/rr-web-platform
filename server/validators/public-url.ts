import { z } from "zod";
import {
  isSafeExternalHttpUrl,
  isSafePublicImageReference,
} from "@/lib/url-safety";

export function externalHttpUrlSchema(message = "Introduce una URL http o https valida.") {
  return z
    .string()
    .trim()
    .refine((value) => value === "" || isSafeExternalHttpUrl(value), message);
}

export function publicImageReferenceSchema(message = "Introduce una ruta publica valida.") {
  return z
    .string()
    .trim()
    .refine((value) => value === "" || isSafePublicImageReference(value), message);
}
