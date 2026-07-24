# Pipeline de archivos y media

Última revisión: 24 de julio de 2026

## Alcance MVP

El MVP solo sube imágenes. Los vídeos se guardan como URLs externas validadas en noticias o partidos, nunca como archivos alojados.

Los binarios no se guardan en MySQL. La base de datos conserva metadata en `MediaAsset`: uso, ruta, URL pública, texto alternativo, MIME, tamaño, anchura y altura.

## Directorios y nombres

Las subidas locales se guardan bajo:

```text
public/media/uploads/{uso}/{yyyy}/{mm}/{nombre-normalizado}-{uuid}.{extension}
```

El `{uso}` se obtiene de `getAdminMediaUsageFolder`:

| Uso | Carpeta |
|---|---|
| `PLAYER_PHOTO` | `players/photos` |
| `PLAYER_CARD` | `players/cards` |
| `TEAM_LOGO` | `teams/logos` |
| `TEAM_BANNER` | `teams/banners` |
| `NEWS_COVER` | `news/covers` |
| `OPPONENT_LOGO` | `matches/opponents` |
| `OTHER` | `general` |

Ejemplo:

```text
public/media/uploads/teams/logos/2026/07/escudo-rising-5f0b...webp
```

La URL pública se deriva de la ruta quitando el prefijo `public/`.

## Validación de subida

El servidor valida:

- uso permitido;
- tamaño máximo de 8 MB;
- MIME permitido: PNG, JPEG, WebP o AVIF;
- extensión coherente con MIME;
- firma real del archivo;
- dimensiones leídas desde el buffer del archivo, no desde datos enviados por el navegador;
- límites mínimos, máximos y proporciones por uso;
- que la ruta final queda dentro de `public/media`.

Los SVG originales no se aceptan como subida pública. Si en el futuro se aceptan, deberán rasterizarse antes de publicar.

## Límites por uso

| Uso | Mínimo | Máximo | Proporción aproximada |
|---|---:|---:|---:|
| Foto jugador | 240×240 | 5000×7000 | 0.45–1.8 |
| Cromo | 320×480 | 5000×7000 | 0.42–1.2 |
| Logo equipo/rival | 64×64 | 2048×2048 | 0.5–2 |
| Banner equipo | 800×260 | 7000×3500 | 1.5–5 |
| Portada noticia | 720×360 | 7000×5000 | 1–3 |
| General | 64×64 | 7000×7000 | libre |

Estos límites son amplios para no bloquear material real, pero evitan imágenes inútiles, enormes o con proporciones claramente equivocadas.

## Optimización y WebP

Si `sharp` está disponible en el runtime, el servidor intenta convertir PNG/JPEG a WebP con orientación normalizada. La conversión solo se conserva si reduce el tamaño del archivo. WebP y AVIF ya subidos se mantienen en su formato.

La app no añade una dependencia nueva solo para esta fase. En Hostinger debe verificarse en Fase E que `sharp` está disponible y que el coste de CPU/memoria es aceptable.

## Borrado recuperable

No se elimina físicamente una imagen enlazada. Antes de borrar se comprueba el contador de referencias en:

- fotos de jugador;
- cromos premium;
- logos/banners de equipo;
- fotos de cuerpo técnico;
- logos de rival;
- portadas de noticia.

Si no tiene referencias, se mueve el archivo fuera de `public/` a:

```text
storage/media-trash/{ruta-original-dentro-de-media}
```

Después se marca `deletedAt` en `MediaAsset`. Si falla la actualización de DB tras mover el archivo, se intenta restaurar el archivo a su ruta pública original.

La limpieza definitiva de `storage/media-trash` debe hacerse manualmente o mediante una tarea futura después de comprobar backups y retención.

