# CACHE_STRATEGY.md

## Objetivo

Evitar que el trafico publico consuma conexiones MySQL innecesariamente. Hostinger permite un maximo de 75 conexiones simultaneas MySQL, suficiente si se disena con cache.

## Principio principal

El panel admin puede consultar MySQL en tiempo real. La web publica debe servir contenido cacheado o pre-generado siempre que sea posible.

## Publico vs admin

### Admin

- Rutas `/admin/**`.
- Consultas en tiempo real a MySQL.
- Requiere auth.
- Sin cache agresiva.

### Publico

- Home.
- Equipos.
- Detalle de equipo.
- Fichas de jugador.
- Partidos.
- Clasificaciones.
- Estadisticas.
- Noticias.

Debe usar cache, ISR o pre-render cuando sea posible.

## Estrategia recomendada en Next.js

- Usar Server Components para datos publicos.
- Aplicar cache/revalidate en consultas publicas.
- Revalidar paginas publicas al publicar cambios desde admin.
- Evitar fetch dinamico sin cache en home y listados.

## Revalidacion

Cuando un admin modifica:

- partido
- resultado
- clasificacion
- estadistica
- jugador
- equipo

Debe revalidarse lo necesario:

- `/`
- `/primer-equipo`
- `/equipos`
- `/equipos/[slug]`
- `/jugadores/[slug]` si aplica
- `/clasificaciones` si existe

## Pool MySQL

Configurar Prisma/MySQL con limite bajo:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB?connection_limit=5"
```

No subir a 20/50 conexiones sin necesidad.

## Consultas

- Paginar listados admin.
- Indexar slugs, seasonId, teamId y campos usados para filtros.
- No consultar tablas enormes sin filtros.
- No hacer N+1 queries en listados publicos.

## Imagenes

- No servir imagenes desde la base de datos.
- Guardar archivos en filesystem/hosting o storage definido.
- Optimizar a WebP/AVIF cuando sea posible.
- Guardar rutas/metadata en DB.

## No hacer

- No hacer que cada visita publica abra multiples consultas MySQL si se puede cachear.
- No usar rr-management en runtime para la web publica.
- No recalcular rankings pesados en cada request.
- No regenerar toda la web ante cualquier cambio menor si basta revalidar rutas concretas.
