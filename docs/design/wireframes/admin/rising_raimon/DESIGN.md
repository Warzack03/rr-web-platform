---
name: Rising Raimon
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d2c5b0'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#9b8f7c'
  outline-variant: '#4e4635'
  surface-tint: '#f0c04e'
  primary: '#ffeccb'
  on-primary: '#3f2e00'
  primary-container: '#fdcb58'
  on-primary-container: '#735500'
  inverse-primary: '#785900'
  secondary: '#b6c7e6'
  on-secondary: '#203149'
  secondary-container: '#374761'
  on-secondary-container: '#a5b6d4'
  tertiary: '#e7eeff'
  on-tertiary: '#223149'
  tertiary-container: '#c3d2f1'
  on-tertiary-container: '#4c5a74'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9d'
  primary-fixed-dim: '#f0c04e'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5b4300'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#b6c7e6'
  on-secondary-fixed: '#091c33'
  on-secondary-fixed-variant: '#374761'
  tertiary-fixed: '#d6e3ff'
  tertiary-fixed-dim: '#b8c7e5'
  on-tertiary-fixed: '#0c1c33'
  on-tertiary-fixed-variant: '#394760'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
  pitch-deep: '#0B1B32'
  stadium-blue: '#1E2F47'
  bolt-gold: '#FDCB58'
  active-glow: rgba(253, 203, 88, 0.25)
typography:
  display-xl:
    fontFamily: Bebas Neue
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Bebas Neue
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Bebas Neue
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Barlow Condensed
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: Barlow Condensed
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Barlow Condensed
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  stat-value:
    fontFamily: Bebas Neue
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The design system for Rising Raimon is built upon an aesthetic of **High-Energy Athleticism**. It captures the intensity of competitive football through a lens of modern, data-driven professionalism. The brand personality is bold, ambitious, and disciplined—evoking the feeling of a prestigious academy where grit meets technical excellence.

The visual direction is **Corporate-Modern with a High-Contrast Athletic edge**. It utilizes a deep, immersive dark mode to establish a premium stadium atmosphere, while using vibrant accents to highlight calls to action and key performance metrics. The style leverages structured data grids and sharp, intentional highlights to ensure the UI feels as fast and precise as the players on the pitch.

## Colors

The palette is anchored by **Pitch Deep**, a rich navy that provides a high-contrast foundation for data readability. 

- **Primary (Bolt Gold):** Used exclusively for high-priority actions, accents, and brand motifs (like the lightning/bolt elements). It should pop against the dark backgrounds.
- **Secondary (Stadium Blue):** Used for surface-level containers, card backgrounds, and secondary interactive elements to provide depth without the harshness of pure black.
- **Tertiary (Surface Stroke):** A lighter blue variant used for subtle borders and dividers.
- **Neutral (Crisp White):** Reserved for primary body text and high-level headings to ensure maximum legibility against dark surfaces.

## Typography

This design system uses a high-impact typographic pairing to reinforce its athletic roots. 

**Bebas Neue** is the primary display face. It should be used for headlines, section titles, and large numbers. Its condensed, vertical nature mimics traditional jersey lettering and creates a sense of height and momentum.

**Barlow Condensed** serves as the functional workhorse. It provides excellent readability for technical data, player stats, and body copy while maintaining the "condensed" aesthetic of the brand.

**Usage Rules:**
- All headlines should be in uppercase to maintain a commanding presence.
- Use the `label-caps` style for small descriptors above headlines or inside chips.
- Tracking (letter spacing) should be slightly increased for `label-caps` to ensure clarity at small sizes.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop (12 columns) and shifts to a fluid single-column layout on mobile.

- **Grid:** 12-column system with 24px gutters. Content is centered within a 1280px max-width container.
- **Rhythm:** Vertical spacing follows an 8px base unit. Section gaps are generous (80px+) to allow the dark theme to "breathe" and keep the focus on specific content modules.
- **Mobile Adaption:** Margins shrink to 20px. Cards reflow from horizontal stacks to vertical lists. Large display type scales down aggressively to avoid text wrapping issues.

## Elevation & Depth

Depth in this design system is created through **Tonal Layers and Subtle Glows** rather than traditional drop shadows.

- **Base Layer:** The `pitch-deep` color serves as the global background.
- **Surface Layer:** Cards and interactive containers use `stadium-blue`. 
- **Borders:** Surfaces are defined by a 1px solid stroke in a slightly lighter blue.
- **Active State:** When an element is focused or active, it utilizes a "Bolt Glow"—a subtle outer shadow using `active-glow` to simulate a stadium light effect.
- **Translucency:** For navigation bars and floating overlays, a backdrop-blur (12px) with 80% opacity of the `pitch-deep` color should be used to maintain context.

## Shapes

The shape language is **Soft-Geometric**. We use a primary radius of 4px (`0.25rem`) to maintain a disciplined, technical feel. 

- **Containers:** Standard cards use `rounded-lg` (8px) to soften the layout and make it feel modern.
- **Buttons:** Primary CTA buttons use a `rounded-xl` (12px) or a full pill-shape to distinguish them from data containers.
- **Form Inputs:** These should maintain a sharp, technical look with a 4px radius.
- **Motifs:** Incorporate 45-degree angles in decorative elements (like corner accents or section dividers) to mimic the energy of a lightning bolt.

## Components

### Buttons
- **Primary:** Background `bolt-gold`, text `pitch-deep`. Bold, uppercase typography. On hover, apply a slight upward shift and an `active-glow`.
- **Secondary:** Transparent background with a `bolt-gold` 1px border.
- **Ghost:** White text with no background, used for tertiary navigation.

### Cards
- **Match Card:** Uses `stadium-blue` background. Displays team crests, score, and match status. Use `stat-value` for scores.
- **Stat Chip:** Small, dark containers with a `bolt-gold` left-side accent border (2px).

### Inputs
- **Field:** Darker than the card background, 1px border. Focus state changes border to `bolt-gold`.
- **Validation:** Use a vibrant "Success Green" or "Alert Red" for feedback, but keep these icons minimal to avoid clashing with the gold brand color.

### Navigation
- A top-mounted fixed bar with a backdrop blur. Use a high-contrast version of the shield logo on the left. Links should be in `label-caps` style.

### Unique Component: "Bolt Divider"
- Instead of a simple line, use a thin horizontal line that features a small 45-degree "zigzag" or bolt break in the middle to reinforce the Rising Raimon brand identity.