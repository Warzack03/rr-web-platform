# Publishing workflow

## MVP decision

- Sport data changes are published immediately on save.
- Public pages should be cached/revalidated after relevant saves.
- News supports editorial states: `DRAFT`, `PUBLISHED`, `ARCHIVED`.

## Immediate publish sport data

Applies to:

- Matches
- Results
- Standings
- Player statistics
- Team public data
- Squad assignments

After saving, revalidate/cache-bust affected public paths:

- `/`
- `/primer-equipo` if relevant
- `/equipos`
- `/equipos/[teamSlug]`
- `/jugadores/[playerSlug]` if stats changed
- `/partidos`
- `/clasificacion`

## News workflow

News can be saved as draft and later published by `superadmin` or `manager`.

Required fields to publish:

- title
- slug
- excerpt
- body or media/link content
- cover image recommended
- publishedAt

## Import workflow

Imports from `rr-management` never publish blindly. They must:

1. Upload CSV/ZIP snapshot.
2. Validate.
3. Compute diff.
4. Preview changes.
5. Confirm.
6. Apply merge/upsert transaction.
7. Revalidate affected public paths.

