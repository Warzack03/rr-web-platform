# CODE_CONVENTIONS.md

## App structure

Prefer this structure:

```text
src/app/(public)/
src/app/admin/
src/app/api/
src/components/public/
src/components/admin/
src/components/layout/
src/components/shared/
src/server/db/
src/server/services/
src/server/validators/
src/lib/
```

If the project already has `server/` at root and it is working, preserve it unless explicitly migrating. Do not break auth/import paths unnecessarily.

## Next.js

- Use App Router.
- Prefer server components by default.
- Use client components only for interactivity.
- Keep route files thin.
- Put business logic in services/actions, not JSX.

## TypeScript

- Use strict TypeScript.
- Avoid `any` unless justified.
- Type form payloads and service responses.

## Database

- Centralize Prisma client.
- Do not instantiate multiple clients directly in components.
- Use services for business operations.
- Validate writes with Zod.
- Check permissions server-side.

## UI

- Build reusable components.
- Do not paste static HTML from mockups without componentization.
- Use tokens/CSS variables.
- Keep UI copy concise.
- Provide loading/empty/error states.

## Admin

- Tables should support filters where useful.
- Forms must show validation errors.
- Critical actions require confirmation.
- Hide disallowed UI actions, but always enforce permissions server-side.

## Public

- Public pages should be indexable.
- Use slugs.
- Avoid fetching private/internal data.
- Cache public data where possible.

## Git discipline

- Small phases.
- Run lint/build/prisma validate after each phase.
- Commit after each successful phase.
