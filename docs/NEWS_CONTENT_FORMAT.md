# Formato editorial de noticias

Última revisión: 28 de julio de 2026

## Decisión D.1

El MVP usará contenido estructurado sencillo, no HTML libre.

Para evitar una migración de esquema inmediata, el contenido se guarda temporalmente en el campo existente `NewsPost.bodyMarkdown`, pero el producto lo trata como una sintaxis editorial restringida que se transforma a bloques públicos seguros.

Nombre funcional recomendado: `contentBlocks` o `structuredContent`. El cambio físico de columna queda para una migración futura, si el editor evoluciona.

## Bloques permitidos en MVP

| Bloque | Sintaxis actual | Render público |
|---|---|---|
| Párrafo | Texto normal separado por línea en blanco | `paragraph` |
| Título interno | `## Título` | `heading` |
| Cita | Líneas que empiezan por `>` | `quote` |
| Atribución de cita | Última línea de cita con `> -- Nombre` o `> — Nombre` | `quote.attribution` |
| Referencia/enlace | `[Etiqueta](https://url)` o `[Etiqueta](https://url) - Descripción` | `link` |
| Vídeo externo | Campo `externalVideoUrl` | `link` externo al final del contenido |

Ejemplo:

```md
## Victoria de carácter

El equipo sostuvo el ritmo del partido y encontró premio en la segunda parte.

> El grupo compitió con personalidad.
> -- Cuerpo técnico

[Acta oficial](https://example.com/acta) - Referencia externa
```

## HTML y seguridad

No se admite HTML libre en el contenido.

El validador rechaza:

- etiquetas HTML como `<script>`, `<iframe>`, `<div>` o similares;
- imágenes Markdown `![alt](url)`;
- enlaces Markdown que no usen `http` o `https`;
- SVG como imagen pública, siguiendo la política de media.

El render público usa componentes React y no necesita `dangerouslySetInnerHTML`.

## Imágenes

En D.1 se mantiene:

- imagen de portada mediante `coverMediaId` o ruta pública segura;
- alt text desde la biblioteca de media;
- imágenes internas no editables todavía desde el cuerpo.

Las imágenes internas quedan definidas como bloque futuro:

```ts
{
  type: "image",
  mediaAssetId: string,
  caption?: string
}
```

No se permiten imágenes internas pegadas como Markdown o URLs libres en el cuerpo. Cuando el editor tenga selector de media por bloque, deberán salir de `MediaAsset` y validar alt/caption.

## Vídeos externos

Los vídeos no se suben. Se guardan como URL externa en `externalVideoUrl`.

Reglas:

- solo `http` o `https`;
- se muestran como referencia externa;
- no se incrustan con HTML libre;
- no se cargan iframes arbitrarios en MVP.

## Enlaces y referencias

Los enlaces dentro del contenido son referencias externas:

- deben usar `http` o `https`;
- se abren como enlaces externos;
- pueden tener descripción breve;
- no deben usarse para ecommerce propio ni datos privados.

## Preview

La previsualización del editor debe usar el mismo parser que el público:

- `validateNewsBodyContent` para validación;
- `buildPublicNewsContentBlocks` para transformar el contenido.

Hasta construir una preview visual completa, el backoffice puede mostrar una ayuda de formato y confiar en la vista pública tras guardar borrador.

## Migración de contenido existente

El contenido existente en `bodyMarkdown` se interpreta de forma compatible:

- párrafos separados por líneas en blanco siguen renderizando como párrafos;
- los bloques que empiecen por `##`, `>` o enlace independiente se enriquecen automáticamente;
- HTML existente debe limpiarse manualmente porque el validador lo rechazará al guardar.

No se requiere migración de base de datos en D.1.

