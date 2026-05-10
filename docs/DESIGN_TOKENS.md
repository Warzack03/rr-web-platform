# DESIGN_TOKENS.md

## Referencia visual

Basado en la landing `inscripciones` existente.

## Tokens base modo oscuro

- bg: `#071629`.
- bgSoft: `#0c2341`.
- surface: `rgba(8, 23, 43, 0.85)`.
- surfaceStrong: `rgba(7, 19, 34, 0.92)`.
- surfaceLight: `rgba(255, 255, 255, 0.08)`.
- text: `#eef4ff`.
- muted: `#bfd0e8`.
- accent: `#f3cb45`.
- accentBlue: `#3470c8`.
- accentRed: `#d64045`.
- border: `rgba(255, 255, 255, 0.12)`.
- radiusXl: `32px`.
- radiusLg: `22px`.
- radiusMd: `16px`.
- radiusSm: `12px`.
- fontDisplay: `Bebas Neue`.
- fontBody: `Barlow`.
- maxWidth: `1180px`.

## Tema claro

La app debe disenarse primero en modo oscuro. El modo claro se implementara al final, cuando el modo oscuro este estable.

Requisitos:

- Usar CSS variables o sistema de tokens desde el inicio.
- No hardcodear colores en componentes.
- Preparar `dark` y `light`, pero priorizar `dark`.
- No dedicar esfuerzo visual al modo claro hasta cerrar la version oscura.

## Componentes visuales esperados

- glass cards.
- hero sections con gradientes.
- botones tipo pastilla.
- tarjetas de equipo.
- cromos de jugador.
- cromo premium Primer Equipo.
- fixture/match cards.
- standings tables.
- stat cards.
- news cards.

## No hacer

- No usar una UI admin generica para la web publica.
- No copiar CSS literalmente si no encaja con Tailwind/Next.
- No crear colores ad hoc por componente.
