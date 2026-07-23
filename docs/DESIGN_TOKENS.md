# DESIGN_TOKENS.md

## Purpose

Centralize design tokens so Codex does not hardcode visual decisions in individual components.

## Dark-first tokens

```css
:root {
  --rr-bg: #0B1B32;
  --rr-bg-alt: #071629;
  --rr-bg-soft: #0c2341;
  --rr-surface: #1E2F47;
  --rr-surface-glass: rgba(8, 23, 43, 0.85);
  --rr-surface-strong: rgba(7, 19, 34, 0.92);
  --rr-surface-light: rgba(255, 255, 255, 0.08);
  --rr-text: #eef4ff;
  --rr-muted: #bfd0e8;
  --rr-gold: #FDCB58;
  --rr-accent: #f3cb45;
  --rr-accent-blue: #3470c8;
  --rr-danger: #d64045;
  --rr-border: rgba(255, 255, 255, 0.12);
  --rr-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
  --rr-radius-xl: 32px;
  --rr-radius-lg: 22px;
  --rr-radius-md: 16px;
  --rr-radius-sm: 12px;
  --rr-font-display: "Bebas Neue", sans-serif;
  --rr-font-body: "Barlow Condensed", "Barlow", sans-serif;
  --rr-max-width: 1180px;
}
```

## Typography

- Display headings: `Bebas Neue`.
- Body/interface: `Barlow Condensed` or `Barlow`.
- Use large condensed headings for public sports pages.
- Admin can use calmer sizing but should remain visually connected to the brand.

## Components should use tokens

Do not hardcode colors repeatedly in JSX. Prefer CSS variables and Tailwind theme mappings.

## Light mode

Light mode is not the first implementation target. However, components must use tokens so a future light theme can redefine variables without rewriting the app.

## Visual components

- Glass cards.
- Technical bordered cards.
- Pill buttons.
- Match cards.
- Stat chips.
- Standings tables.
- Player cards.
- Generated card/cromo.
- Premium generated card layers.
- Admin dashboard cards.
- Empty/loading/error states.
