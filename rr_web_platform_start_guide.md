# Guía de arranque para `rr-web-platform`

Esta guía explica qué hacer desde la descarga del ZIP de contexto hasta la primera tarea real con Codex.

## 0. Descargar el pack de contexto

Descarga el último pack preparado para Codex:

```text
rr_codex_context_pack_v6.zip
```

Contiene:

```text
AGENTS.md
docs/
  ...documentación técnica y funcional del proyecto
```

La idea es que estos archivos vivan dentro del repo desde el principio para que Codex tenga contexto persistente y no tengas que repetir decisiones en cada prompt.

---

## 1. Crear carpeta del proyecto

En tu máquina:

```bash
mkdir rr-web-platform
cd rr-web-platform
```

Descomprime dentro de esa carpeta el ZIP `rr_codex_context_pack_v6.zip`.

La estructura debería quedar así:

```text
rr-web-platform/
  AGENTS.md
  docs/
    DECISIONS.md
    MVP_SCOPE.md
    DOMAIN_MODEL.md
    DATABASE_FINAL_MODEL.md
    PRISMA_SCHEMA_DRAFT.md
    ...
```

---

## 2. Inicializar Git

```bash
git init
git add .
git commit -m "Add Codex context pack"
```

Este primer commit deja guardado el contexto funcional y técnico antes de generar código.

---

## 3. Crear el proyecto Next.js

Desde dentro de `rr-web-platform`, ejecuta:

```bash
npx create-next-app@latest .
```

Cuando pregunte, usa estas opciones recomendadas:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src/ directory: Yes
App Router: Yes
Turbopack: No, de momento mejor no
Import alias: Yes
Alias: @/*
```

Si te avisa de que la carpeta no está vacía y permite continuar, acepta.

Si no te deja crear el proyecto en una carpeta no vacía, usa esta alternativa:

```bash
cd ..
npx create-next-app@latest rr-web-platform-app
```

Después copia `AGENTS.md` y la carpeta `docs/` dentro de `rr-web-platform-app`.

---

## 4. Instalar dependencias base

Dentro del proyecto Next.js:

```bash
npm install
```

Instala las dependencias base:

```bash
npm install prisma @prisma/client zod bcryptjs
npm install next-auth
npm install lucide-react clsx tailwind-merge
npm install -D tsx
```

### Inicializar shadcn/ui

```bash
npx shadcn@latest init
```

Opciones recomendadas:

```text
Style: New York
Base color: Slate
CSS variables: Yes
```

Añadir componentes base:

```bash
npx shadcn@latest add button card input label table badge dropdown-menu dialog textarea select tabs form
```

---

## 5. Crear variables de entorno

Crea `.env.example`:

```bash
touch .env.example
```

Contenido recomendado:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE?connection_limit=5"
AUTH_SECRET="change-me"
AUTH_URL="http://localhost:3000"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"

UPLOAD_DIR="./uploads"
ADMIN_INITIAL_EMAIL="admin@example.com"
ADMIN_INITIAL_PASSWORD="change-me"
```

Después crea tu `.env` local:

```bash
cp .env.example .env
```

Edita `.env` con tus valores reales.

Nunca subas `.env` al repositorio.

---

## 6. Preparar MySQL local

Tienes dos opciones.

### Opción A: MySQL local

Si tienes MySQL instalado, crea la base de datos:

```sql
CREATE DATABASE rr_web_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ejemplo de `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/rr_web_platform?connection_limit=5"
```

### Opción B: Docker

Si tienes Docker:

```bash
docker run --name rr-web-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=rr_web_platform \
  -p 3306:3306 \
  -d mysql:8
```

Ejemplo de `.env`:

```env
DATABASE_URL="mysql://root:root@localhost:3306/rr_web_platform?connection_limit=5"
```

---

## 7. Primera tarea para Codex

Abre el proyecto en Codex.

No le pidas construir toda la app. Dale una primera tarea pequeña:

```text
Lee AGENTS.md y los documentos de docs/.
Primera tarea: inicializa Prisma para MySQL e implementa el schema inicial siguiendo docs/DATABASE_FINAL_MODEL.md, docs/PRISMA_SCHEMA_DRAFT.md y docs/DATABASE_IMPLEMENTATION_NOTES.md.

No implementes UI todavía.
No añadas funcionalidades fuera de alcance.
Crea o actualiza prisma/schema.prisma.
Añade un seed mínimo si está contemplado en docs/SEED_DATA.md.
Al final ejecuta npm run lint y npx prisma validate.
Resume los cambios realizados.
```

---

## 8. Validar después de Codex

Cuando Codex termine, ejecuta localmente:

```bash
npx prisma validate
```

Si todo está bien:

```bash
npx prisma migrate dev --name init
```

Después:

```bash
npm run lint
npm run build
```

Si hay errores, cópialos tal cual y pásaselos a Codex con un prompt corto.

---

## 9. Segunda tarea recomendada para Codex

Cuando la base de datos esté lista:

```text
Implementa la autenticación admin siguiendo AGENTS.md, docs/PERMISSIONS_MATRIX.md, docs/ROLES_PERMISSIONS.md y docs/CODE_CONVENTIONS.md.

Alcance:
- login
- logout
- protección de rutas /admin
- seed de usuario superadmin inicial
- layout base de admin

No implementes CRUDs todavía.
Al final ejecuta lint/build y resume cambios.
```

---

## 10. Orden de trabajo recomendado

No empezar directamente por la web visual. El orden recomendado es:

```text
1. Prisma schema + migración inicial
2. Seed demo
3. Auth admin
4. Layout admin
5. CRUD temporadas
6. CRUD equipos
7. CRUD jugadores
8. Asignaciones jugador-equipo-temporada
9. CRUD partidos
10. Clasificaciones manuales
11. Estadísticas por partido
12. Noticias
13. Media/cromos
14. Web pública básica
15. Detalle de equipo
16. Home pública
17. Diseño visual premium
18. Deploy beta en Hostinger
```

---

## 11. Crear repo en GitHub

Cuando tengas el proyecto inicial:

```bash
git add .
git commit -m "Initialize Next.js project"
```

Crea un repo nuevo en GitHub, por ejemplo:

```text
rr-web-platform
```

Conecta el remoto:

```bash
git remote add origin https://github.com/warzack03/rr-web-platform.git
git branch -M main
git push -u origin main
```

Cambia la URL si usas otro nombre de repo.

---

## 12. Cuándo desplegar en Hostinger

No desplegar todavía si no funciona en local.

Primero conseguir que esto funcione:

```text
- build pasa
- Prisma conecta
- login admin funciona
- dashboard admin carga
```

Después montar el entorno beta:

```text
beta.risingraimon.es
```

como Node.js App en Hostinger.

---

## 13. Resumen rápido de comandos iniciales

```bash
mkdir rr-web-platform
cd rr-web-platform
# descomprimir rr_codex_context_pack_v6.zip aquí

git init
git add .
git commit -m "Add Codex context pack"

npx create-next-app@latest .

npm install prisma @prisma/client zod bcryptjs next-auth lucide-react clsx tailwind-merge
npm install -D tsx

npx shadcn@latest init
npx shadcn@latest add button card input label table badge dropdown-menu dialog textarea select tabs form

touch .env.example
cp .env.example .env
```

Luego abrir Codex y lanzar solo la primera tarea:

```text
Implementar Prisma schema inicial siguiendo la documentación del repo.
```

---

## 14. Regla práctica para trabajar con Codex

No usar prompts gigantes.

Usar este patrón:

```text
Implementa [tarea pequeña] siguiendo AGENTS.md y docs/[documentos relevantes].
No añadas funcionalidades fuera de alcance.
Ejecuta lint/build/validate si aplica.
Resume cambios.
```

Ejemplos:

```text
Implementa CRUD de temporadas siguiendo docs/ADMIN_PAGE_SPECS.md, docs/DATABASE_FINAL_MODEL.md y docs/CODE_CONVENTIONS.md.
```

```text
Implementa la página pública de detalle de equipo siguiendo docs/TEAM_DETAIL_PAGE.md, docs/PUBLIC_PAGE_SPECS.md y docs/DESIGN_TOKENS.md.
```

```text
Implementa la importación desde rr-management siguiendo docs/IMPORT_FORMAT.md y docs/FIELD_POLICIES.md.
```

---

## 15. Decisiones clave que no debe cambiar Codex

Recordatorio de decisiones cerradas:

```text
- Nueva plataforma en Hostinger Business con coste añadido inicial 0.
- Stack: Next.js + TypeScript + MySQL + Prisma + Auth.js + Tailwind + shadcn/ui.
- rr-management se mantiene separado para gestión interna sensible.
- rr-management solo aporta maestro deportivo mediante importación puntual/merge.
- No se usa rr-management como backend vivo de la web pública.
- WordPress/WooCommerce se mantiene para tienda y pagos.
- Tienda en subdominio: tienda.risingraimon.es.
- Web pública y backoffice deportivo en la nueva plataforma.
- No borrar datos de forma destructiva al importar.
- Las estadísticas se quedan asociadas al equipo/temporada/partido donde se crearon.
- Solo superadmin gestiona usuarios e importaciones.
- Managers gestionan contenido deportivo, imágenes y noticias.
- Entrenadores solo editan datos deportivos permitidos de su equipo.
- Diseño primero en modo oscuro; modo claro al final.
```
1. Temporadas
2. Equipos
3. Usuarios/permisos de entrenador por equipo
4. Jugadores
5. Asignaciones jugador-equipo-temporada
6. Partidos
7. Clasificaciones manuales
8. Estadísticas por partido
9. Noticias
10. Media / imágenes / cromos
11. Importación desde rr-management
12. Web pública básica
13. Detalle público de equipo
14. Home pública
15. Diseño premium
16. Deploy beta en Hostinger