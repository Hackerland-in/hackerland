# Hackerland Mission Control — Design System

The visual language of [hackerland.in](https://hackerland.in): **mission control × maker workshop**.
It evolved from the *Aerospace Maker System* Stitch export (preserved verbatim in
[`docs/design/stitch-source/DESIGN.md`](../../docs/design/stitch-source/DESIGN.md)) and was
widened from aerospace to everyone who builds: students, designers, programmers, makers,
researchers and innovators.

- **Tokens:** [`src/theme.css`](src/theme.css) (Tailwind CSS v4 `@theme`), mirrored in [`src/tokens.ts`](src/tokens.ts)
- **Components:** [`src/components`](src/components), exported from `@hackerland/ui`
- **Living style guide:** `/design-system` in the web app

## Brand & style

Users should feel they have walked into an orbital mission-control room fused with an
open-access garage workshop. That means deep navy canvases, hairline structure, telemetry-style
labels and warm energetic accents. The interface is disciplined, never sterile.

- The telemetry vocabulary (`LIVE`, mesh status, monospace-style labels) is **brand flavour**.
  Navigation and actions use plain language: "Join squad", "Start project".
- Each view has at most **one** glowing primary call to action.

## Colour

All colours are semantic Tailwind utilities, for example `bg-surface-1`, `text-fg-muted`,
`border-hairline` and `text-make-fg`. Never use raw hex values in components.

### Navy scale (tonal elevation)

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#0A0E17` | Page background (level 0) |
| `surface-1` | `#101726` | Cards, panels (level 1) |
| `surface-2` | `#182238` | Raised modules, hover (level 2) |
| `surface-3` | `#1C2842` | Popovers, overlays (level 3) |
| `sunken` | `#0D131F` | Inputs, code, wells |
| `hairline` | `#1E2B45` | Card and divider borders |
| `line` | `#2A3B5E` | Control borders |
| `fg` / `fg-muted` / `fg-subtle` | `#F0F4FC` / `#A9B6CC` / `#7D8DA8` | Text: primary, secondary, tertiary |

### Primary

**Ion Cyan `#00E5FF`** (`accent`) is the only primary colour, used for primary actions, focus
rings and links. Put `on-solid` (`#060B12`) text on solid cyan.

### Tracks

Every project, person and opportunity is tagged with one or more tracks. Each track has a solid
colour (`<track>`, used for borders, bars and fills, with tints via opacity such as `bg-make/12`)
and a text colour (`<track>-fg`).

| Track | Covers | Solid | Text |
|---|---|---|---|
| **Code** | Software, web, mobile, AI/ML | `#00E5FF` | `#38E8FF` |
| **Make** | Hardware, robotics, electronics, fabrication | `#FF8A00` | `#FFA033` |
| **Design** | UI/UX, product, visual, industrial | `#FF5FA2` | `#FF85B8` |
| **Research** | Deep-tech, space, bio, climate, science | `#A970FF` | `#C29BFF` |
| **Earn** | Bounties, paid roles, grants, prizes | `#00F59B` | `#5CFFBA` |
| **Learn** | Roadmaps, courses, mentorship | `#4D9FFF` | `#7DB8FF` |

### Status

| Token | Hex | Use |
|---|---|---|
| `success` | `#00F59B` | Success, live, ready |
| `warning` | `#FFD600` | Caution, preview |
| `danger` | `#FF334B` | Errors, destructive actions |
| info | `accent` | Informational |

## Typography

- **Space Grotesk** for display text, headings, labels and numbers (`font-display`)
- **Inter** for body and UI text (`font-sans`, the default)
- **JetBrains Mono** for code blocks (`font-mono`)
- Use `tabular-nums` for every changing number: money, counters, stats.
- All caps is allowed **only** on `label-*` styles.

| Token | Size / line height | Tracking | Weight |
|---|---|---|---|
| `display-hero` | 56 / 64 | -0.03em | 700 |
| `display-hero-mobile` | 36 / 44 | -0.02em | 700 |
| `headline-xl` | 40 / 48 | -0.02em | 600 |
| `headline-xl-mobile` | 28 / 36 | -0.01em | 600 |
| `headline-lg` | 28 / 36 | -0.01em | 600 |
| `headline-md` | 22 / 30 | 0 | 500 |
| `headline-sm` | 18 / 26 | 0 | 500 |
| `body-lg` | 18 / 28 | — | 400 |
| `body-md` | 15 / 24 | — | 400 |
| `body-sm` | 13 / 20 | — | 400 |
| `label-lg` | 14 / 18 | 0.04em | 600 |
| `label-md` | 12 / 16 | 0.05em | 600 |
| `label-sm` | **11** / 14 | 0.08em | 700 |
| `code-inline` | 13 / 18 | — | 500 |

Running text is never smaller than `body-md` (15px). `body-sm` is for metadata only.

## Layout & spacing

- 4px / 8px rhythm (Tailwind's default spacing scale).
- Page container `max-w-page` (1440px) with side padding of 16px (mobile), 24px (tablet) and
  48px (desktop).
- Grids: 4 columns on mobile, 8 on tablet and 12 on desktop. Two-column pages use a fluid main
  column plus a 360px rail (`lg:grid-cols-[minmax(0,1fr)_360px]`).
- On phones, primary navigation moves to a fixed bottom bar.
- Any element that can hold user content gets `min-w-0` and `break-words`. The page must never
  scroll sideways.

## Elevation

| Level | Surface | Treatment |
|---|---|---|
| 0 Ground | `canvas` | — |
| 1 Deck | `surface-1` | `border-hairline` |
| 2 Active module | `surface-2` | `shadow-module`; border tints `accent/20` on hover |
| 3 Overlay | `surface-3` | `shadow-overlay`, `border-white/12` |

Glows (`shadow-glow-accent`, `shadow-glow-make`, `shadow-glow-earn`) appear **only** on
hover/focus and on the single primary CTA.

## Shape

The default radius is 4px (`rounded-sm`) for controls, badges and inputs. Cards use 8px
(`rounded-lg`) and dialogs or command bars use 12px (`rounded-xl`).

## Motion

Transitions run 150–200ms with ease-out. Pulses, shimmers and progress fills use `motion-safe:`,
and `prefers-reduced-motion` disables motion globally.

## Components

| Component | Purpose |
|---|---|
| `Button` | Variants `primary`, `secondary`, `ghost`, `make`, `earn`, `danger`; sizes `sm`, `md` (44px), `lg`; `loading`; `asChild` |
| `IconButton` | Square icon-only action; `label` becomes its accessible name |
| `Badge` | 22px uppercase metadata tag, toned by track or status |
| `Chip` / `FilterChip` | Skill/tag pills; toggleable filter pills (`aria-pressed` / `aria-current`) |
| `StatusDot` | Live/status indicator with optional pulse and screen-reader label |
| `Input`, `Textarea`, `SearchField`, `Label` | Form controls with `invalid` state |
| `Card` (+ `CardHeader/Body/Footer`) | Level-1 container; optional track accent bar on hover |
| `Panel` | Titled section (`<section>` labelled by its heading) |
| `SectionHeader` | Eyebrow + title + description + action |
| `StatTile` | KPI readout |
| `ProgressBar`, `SegmentedProgress` | Accessible progress (`role="progressbar"`) |
| `Avatar`, `AvatarGroup` | Image or initials, with overflow count |
| `Tabs` | WAI-ARIA tabs with arrow/Home/End keys |
| `CodeBlock` | Monospace code with optional filename; scrolls inside itself |
| `EmptyState` | Friendly zero-results state with an action |
| `Kbd`, `Divider` | Keyboard hint, separator |

## Accessibility rules

- Body text contrast is at least 4.5:1 on every surface it sits on. `fg-subtle` is the lowest
  text colour allowed.
- Default-size interactive controls are at least 44px tall.
- Every interactive element shows a visible `:focus-visible` ring (2px accent, 2px offset).
- Icon-only controls always have an accessible name.
- Never convey state by colour alone. Badges always carry text.
- **No ages anywhere.** Many members are under 18 (India's DPDP Act treats them as children).
  Use opt-in experience badges ("Student", "40+ yrs aerospace") instead.

## Changes from the source system

1. **One palette.** The YAML (grey Material-3 surfaces) and the prose (navy scale) disagreed, and
   screens mixed cyan and neon green as primary. Navy and cyan won; green now means success/earn
   only.
2. **Three tiers** (primitive → semantic → Tailwind utility), so a light theme is one block away.
3. **Tracks replace aerospace domains**, adding Design (pink) and Learn (blue), and lightening
   Plasma to `#A970FF` so it is legible on navy.
4. **`label-sm` raised from 10px to 11px**, with a 15px minimum for body text.
5. **Glow discipline:** hover/focus and one primary CTA only.
6. **JetBrains Mono** added for code, because Space Grotesk is not monospaced.
7. **Material Symbols replaced by `lucide-react`**: tree-shaken SVGs with no icon-font flash.
8. **Age badges removed** in favour of experience badges.
9. **Plain-language navigation**, keeping the telemetry tone as flavour.
