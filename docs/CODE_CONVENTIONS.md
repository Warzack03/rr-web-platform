# CODE_CONVENTIONS.md

## Stack

- Next.js App Router.
- TypeScript estricto.
- Prisma.
- MySQL.
- Tailwind.
- shadcn/ui cuando aporte valor.
- Zod para validacion.

## Estructura recomendada

- `src/app` - rutas Next.js.
- `src/components` - componentes UI reutilizables.
- `src/components/public` - componentes web publica.
- `src/components/admin` - componentes admin.
- `src/server/db` - cliente Prisma/acceso DB.
- `src/server/services` - logica de negocio.
- `src/server/validators` - esquemas Zod.
- `src/server/auth` - auth/permisos.
- `src/lib` - utilidades compartidas.

## Reglas

- Server components por defecto.
- Client components solo para interaccion.
- No meter queries Prisma complejas directamente en componentes visuales.
- Centralizar permisos en servidor.
- No confiar solo en ocultar botones del frontend.
- Usar acciones pequenas y testeables.
- Evitar dependencias innecesarias.
- Mantener prompts/tareas pequenas por epic.

## Nombres

- Entidades en ingles en codigo: `Team`, `Player`, `Season`, `Match`, `Standing`.
- Textos UI en espanol.
- Slugs limpios, minusculas y sin espacios.
