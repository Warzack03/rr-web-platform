# Definition of Done

An implementation task is done when:

- TypeScript compiles.
- `npm run build` passes.
- Lint passes if configured.
- Server-side validation exists for mutations.
- UI shows useful loading/error/empty states.
- Admin routes are protected.
- Role permissions are enforced server-side, not only in UI.
- Public pages do not expose private/sensitive fields.
- Public pages are cacheable or revalidated intentionally.
- Mobile layout is usable.
- Relevant docs are updated if behavior changes.

## Additional criteria for imports

- Import validates required columns.
- Import shows preview/diff.
- Import uses merge/upsert, not destructive delete.
- Stats, matches and historical relations are not moved or deleted accidentally.
- Import log is stored.

## Additional criteria for stats

- Stats are associated with player + team + season + match when possible.
- Season aggregates are derived from base stats.
- Goal participation is goals + assists.
- Negative stats are rejected.

