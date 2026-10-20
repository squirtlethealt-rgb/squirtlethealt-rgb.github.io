# Chunky Cartoon Game UI — Style Guide

> Also known as: **Candy UI**, **Chunky Flat UI**, **Hyper-casual / Casual Mobile Game UI**, **Outlined Flat Design with Hard Shadows**.
> Use this doc alongside the reference HTML template when building out the real project — it captures the *rules*, not just the one-off values, so new components stay consistent.

---

## 1. Core Visual Principles

1. **Flat, fully opaque fills only.** No gradients, no glassmorphism, no transparency on panels/buttons/cards. Every surface is a single solid color.
2. **Thick, consistent dark outlines** on every interactive/contained element (buttons, cards, panels, icons, pills).
3. **Hard, 0-blur offset drop shadows** instead of soft blurred shadows — this is what gives the "3D pressed cardboard/candy" feel.
4. **Tactile press feedback** — on `:active`, the element moves down and its shadow collapses to 0, simulating a physical button press.
5. **Rounded everything.** No sharp corners anywhere except tiny accent details (e.g. corner brackets on the settings panel).
6. **High-saturation, candy-like color palette** — bold primary/secondary colors, minimal use of muted or desaturated tones (grays are used only for neutral UI chrome, not accents).

---

## 2. Design Tokens

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--ink` (outline/shadow) | `#18202d` | All borders, all hard shadows, primary text |
| `--shadow-color` | `rgba(24,32,45,0.95)` | Drop shadow color (near-opaque ink) |
| White | `#ffffff` | Panel backgrounds, icon boxes |
| Slate (neutral bg) | `#d5dfe6` / `#cbd5e1` | Currency bundle box, RPG base board |
| Gold / Coin | `#fed034`, `#f59e0b` | Currency, primary accents |
| Green (success/play) | `#6fc624`, `#84cc16`, `#4ade80` | Buy buttons, Play button, potion items |
| Red (danger/close) | `#f14343`, `#f87171`, `#ef4444` | Close buttons, exit, warnings, HP bars |
| Blue (info/home) | `#299bf5`, `#38bdf8` | Home dock, save button, MP bars |
| Purple/Magenta (premium) | `#c026d3`, `#9333ea` | Gems, inventory panel |
| Brown (wood/coin sack) | `#934624`, `#b45309`, `#78350f` | Wooden frame, coin sack |

**Rule of thumb:** pick ONE saturated hue per component type (buttons, cards, currencies) and stay consistent — e.g. red always = danger/close, green always = positive/confirm, blue always = neutral/info.

### Borders & Shadows

| Element size | Border width | Shadow offset |
|---|---|---|
| Small (dock icons, pills, tags) | `2.5–3px` | `2–3px` |
| Medium (buttons, item cards) | `3.5px` | `4.5–5px` |
| Large (modals, main panels) | `4–4.5px` | `6–7px` |

- Shadow is always **0 blur**, solid color, offset only on Y-axis (`0 Npx 0 var(--shadow-color)`).
- On `:active`/press: `translateY(Npx)` equal to the shadow offset, shadow becomes `0 0 0`.

### Radius

- Small elements (pills, tags, toggle knobs): `12–18px`
- Buttons / cards: `14–18px`
- Large panels / modals: `24–28px`

### Typography

- **Display font (headers, buttons, numbers):** `Lilita One` — chunky, condensed, cartoon display font.
- **Body font (descriptions, labels):** `Fredoka` (600–900 weight) or `Nunito` (800–900 weight).
- Headers often use `-webkit-text-stroke` to add an outline directly to the text (e.g. "SHOP" title).
- All-caps is standard for buttons, labels, and section titles.
- Letter-spacing: slightly increased (`tracking-wide` / `0.03em`) on display text.

### Background

- Ambient **soft, blurred, multi-stop radial/linear gradient** — NOT flat color, NOT hard-edged shapes.
- Avoid single hard color-stop circles (`color Npx, transparent (N+1)px`) — these read as flat stickers.
- Prefer: `radial-gradient(circle at X% Y%, color 0%, transparent 65-75%)` combined across 3–5 overlapping blobs, or a large `filter: blur(60-80px)` applied to background shapes, so colors bleed smoothly into each other (green → teal → warm orange is the reference palette).

---

## 3. Component Patterns

### Currency Pill (HUD)
- White pill, `3.5px` ink border, hard shadow.
- Icon (flat SVG, own outline) + bold number + small square "+" action button in accent color.

### Buttons (`chunky-btn`)
- Solid fill + ink border + hard offset shadow.
- `:hover` → slight brightness increase only (no scale/shadow change).
- `:active` → `translateY` by shadow-offset amount + shadow flattens to 0.
- Color-coded by intent: green = confirm/play, red = danger/exit/close, blue = neutral/save, gray = secondary/continue.

### Cards (shop items, character cards)
- Solid saturated background color per category.
- White rounded icon-box inset (own border + small shadow) top-left or centered.
- Bold title + smaller regular-weight description.
- Price/tag pill anchored bottom-right, dark background, light text.
- Whole card is clickable; `:active` triggers the press animation.

### Modals / Panels
- White or light-slate background, thick ink border, largest shadow offset in the system.
- Header row: icon badge (small colored square, own border+shadow) + title + close button (top-right, red).
- Internal sections separated by their own bordered/shadowed sub-panels (not just spacing) — e.g. the currency bundle box inside the shop modal.

### Toggles / Sliders / Checkboxes
- Toggle track: dark navy off-state, accent color on-state, ink border, small hard shadow.
- Knob: white circle, ink border, slides on transform.
- Sliders: native `<input type=range>` with `accent-color` set to match theme (simplest cross-browser approach for this style).
- Checkboxes/radio: custom square/circle divs with ink border, checkmark or dot shown/hidden via class toggle.

### Dock / Icon-only Buttons
- Fixed-size square (e.g. `60x60`), rounded corners, solid accent background, ink border, hard shadow.
- Icon is white-fill SVG with ink stroke, centered.
- `:active` → same press-down treatment as other buttons.

---

## 4. Interaction & Feedback Rules

- **Every clickable element must have a press state** (`translateY` + shadow collapse). Never skip this — it's the single biggest contributor to the "juicy" feel.
- **Custom cursor** (optional but part of the reference) — a simple hand/pointer SVG cursor reinforces the toy-like feel.
- **Sound effects on interaction** — short synthesized clicks/coin/gem chimes (Web Audio API in the reference) reinforce tactility even without real audio assets.
- **Floating feedback text** (`+500 COINS`) on currency gains — spawns above the HUD, animates upward while fading out, then removes itself.
- **Toast notifications** for state changes (purchases, settings saved, errors) — bottom-center, dark pill, auto-dismiss after ~2s.

---

## 5. Assets Needed (Not CSS-Buildable)

These require actual icon/illustration assets — either purchase a matching pack (e.g. "Vector Icon Pack" / "Vector Item Tiers" style packs), source from Kenney.nl / Flaticon / Freepik game-UI packs, or commission custom art:

- Currency icons (coin, gem) — *can be approximated in SVG as shown in the reference, but a real pack will look more polished*
- Item icons (feather, potion, hat, sword, shield, etc.)
- Character portraits/sprites (knight, wizard, etc.)
- Coin sack / treasure illustrations
- Any decorative mascot/brand watermark

Everything else (panels, buttons, sliders, palette swatches, layout, shadows, borders) is pure CSS and does not require assets.

---

## 6. Build Checklist (for new components)

When adding a new UI piece, run it through this checklist to keep it on-style:

- [ ] Solid opaque background color (no gradient, no transparency)
- [ ] `3–4.5px` ink-colored border (scaled to element size)
- [ ] Hard 0-blur offset shadow (scaled to element size)
- [ ] Rounded corners (`14px`+ depending on size)
- [ ] Press state implemented (`translateY` + shadow flatten) if interactive
- [ ] Text in Lilita One (display) or Fredoka/Nunito (body), bold/black weight
- [ ] Color chosen from the approved palette, matched to semantic meaning (green=go, red=stop, blue=neutral, gold/purple=currency)
- [ ] Icon (if any) sits in its own white rounded box with its own mini border+shadow, OR is a flat SVG with ink stroke directly

---

## 7. Reference Files

- `template.html` — the working HTML/Tailwind reference implementation (Shop screen + RPG UI Kit screen + shared HUD/dock).
- This style guide should be treated as the source of truth for *new* screens; the template is the source of truth for *exact* token values already in use.
