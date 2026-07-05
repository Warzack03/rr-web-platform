# Seed data

## Goal

Provide realistic data for local development, screenshots and UI validation without depending on production data.

## How to implement

Create a Prisma seed script that inserts a small sample dataset.

Suggested command:

```bash
npm run db:seed
```

or:

```bash
npx prisma db seed
```

## Required seed entities

### Users

- `superadmin` user: `admin@risingraimon.local`
- `manager` user: `manager@risingraimon.local`
- `coach` user: `entrenador_primer_equipo@risingraimon.local`

Use safe local/dev passwords only. Do not commit production passwords.

### Season

- Season `2026/2027`
- Mark as active/current

### Teams

- Primer Equipo
- Juvenil A
- Cadete A

### Coaches

- Primer Equipo: two or three public coaches
- Coaches are informative team data and do not need linked accounts in seed mode

### Players

Create around 8 to 12 demo players:

- Include goalkeepers and field players
- Include different countries/flags
- Include foot, shirt number, position
- Include first-team and non-first-team players

### Matches

Create at least:

- One scheduled next match
- One played match with score
- One postponed match
- One first-team played match with external video URL

### Standings

Create a manual standings table with 5 rows and mark own team.

### Stats

Create per-match statistics for first team and simplified stats for a non-first-team.

### News

Create:

- One published featured news item
- One draft news item
- One news item linked to a team and with external video URL

## Seed data principles

- No real NIF/DNI, phone, address or sensitive data.
- Use obvious fake/demo data.
- Do not import from production `rr-management` for seeds.
- Keep seed deterministic where possible.
