# PlainDoc Anthropic-Inspired Design System

This design system shifts **PlainDoc** to a warm, literary, editorial aesthetic inspired by Anthropic/Claude.com. It relies on a high-contrast pacing rhythm between a warm cream canvas and dark navy terminal/product surfaces, bound together by a signature coral accent.

---

## 1. Core Typography

We pair a literary serif display typeface with a clean humanist sans-serif body:
- **Headings & Accents:** **EB Garamond** (Tiempos Headline / Copernicus substitute) - weight 400 with negative letter-spacing (`tracking-tight` / `-0.02em`).
- **Body & Controls:** **Inter** (StyreneB substitute) - weight 400 (regular) and 500 (medium).
- **Code & Monospace:** **JetBrains Mono** - for agent log outputs, terminal windows, and code blocks.

---

## 2. Color Palette (Tinted Cream & Coral Aura)

### Brand & Accent
- **Coral / Primary** (`#cc785c`): The signature accent color. Used for primary CTAs, inline links, and high-voltage highlight cards.
- **Coral Hover** (`#a9583e`): Press / hover variant.
- **Accent Teal** (`#5db8a6`): Used for terminal success indicators and positive status dots.
- **Accent Amber** (`#e8a55a`): Used for warm alerts or mid-urgency badges.

### Surface Colors
- **Canvas (Default floor):** `#faf9f5` (tinted warm cream, distinctly not cool gray or white).
- **Surface Soft (Dividers):** `#f5f0e8` (soft backgrounds).
- **Surface Card:** `#efe9de` (feature cards, one step darker than canvas).
- **Surface Cream Strong:** `#e8e0d2` (emphasized tabs or selected active states).
- **Surface Dark:** `#181715` (dark navy/charcoal for terminal log screens, code blocks, chatbot window headers, and footers).
- **Hairline Border:** `#e6dfd8` (the 1px border tone on cream surfaces).

### Text Colors
- **Ink (Primary text):** `#141413` (warm dark, off-pure-black).
- **Body default:** `#3d3d3a` (default running text).
- **Muted text:** `#6c6a64` (sub-captions, secondary labels).
- **On Primary:** `#ffffff` (text on coral buttons).
- **On Dark:** `#faf9f5` (cream-tinted white for dark surfaces).

---

## 3. Elevation & Depth

- **Color-block first, shadow rare:** Avoid heavy box-shadows. Depth is established through the juxtaposition of cream and dark navy surfaces.
- **Subtle borders:** Use 1px `{colors.hairline}` (`#e6dfd8`) to define sections.
- **Hover transition:** Cards translate up by `2px` with a very subtle drop shadow: `0 2px 8px rgba(20, 20, 19, 0.05)`.

---

## 4. Layout & Shapes

- **Border Radius Hierarchy:**
  - `{rounded.md}` (8px) for buttons, inputs, and tab pills.
  - `{rounded.lg}` (12px) for content cards (risks, money, timeline, actions).
  - `{rounded.xl}` (16px) for the main upload container and chatbot window.
  - `{rounded.pill}` (9999px) for category badges and tags.
- **Spacing rhythm:** Section padding is `96px` (spacing.section) to allow typography to breathe.
