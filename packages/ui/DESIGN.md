# Hackerland Rosepaper Social — Design System

The visual language of [hackerland.in](https://www.hackerland.in): **creator-first social community × open hardware workshop**.
Grounded in the original Hackerland brand identity: **crisp white surfaces (`#FFFFFF`)**, soft paper canvas (`#F7F7FA`), and **Signature Hackerland Pink (`#FA1681`)** — built to feel like a welcoming, high-energy social network for builders, makers, designers, students, and researchers.

- **Tokens:** [`src/theme.css`](src/theme.css) (Tailwind CSS v4 `@theme`), mirrored in [`src/tokens.ts`](src/tokens.ts)
- **Components:** [`src/components`](src/components), exported from `@hackerland/ui`
- **Living style guide:** `/design-system` in the web app

## Brand & style

Hackerland feels like an open builder square: conversational feeds, instant reactions, threaded build discussions, clickable creator profiles, and friendly `#FA1681` pink actions on airy white surfaces.

- Plain conversational UI copy ("Follow", "Post update", "Comment", "Ship together").
- At most **one** high-emphasis solid `#FA1681` CTA per view or composer; supporting actions stay soft or outlined.
- Crisp white default theme (`data-theme="light"`), with an optional calibrated midnight charcoal Dark Mode (`data-theme="dark"`).

## Colour

All colours are semantic Tailwind utilities (`bg-surface-1`, `text-fg-muted`, `border-hairline`, `text-accent-fg`). Never write raw hex values inside components.

### Light / White Default Scale

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#F7F7FA` | Page background (level 0) |
| `surface-1` | `#FFFFFF` | Feed posts, composer cards, sidebars, top bar (level 1) |
| `surface-2` | `#F2F3F7` | Reaction pills, hover wells, tab tracks (level 2) |
| `surface-3` | `#E6E8F0` | Popovers, active pill wells (level 3) |
| `sunken` | `#F4F5F8` | Search fields, inputs, code blocks |
| `hairline` | `#E6E8EF` | Card and feed borders |
| `line` | `#D1D5E2` | Control borders |
| `fg` / `fg-muted` / `fg-subtle` | `#111827` / `#4B5563` / `#6B7280` | Text: primary, secondary, metadata |
| `accent` / `accent-strong` / `accent-fg` | `#FA1681` / `#E00E70` / `#D10D69` | Signature Hackerland Pink |
| `accent-soft` | `#FFF0F7` | Gentle pink tint for active nav & highlight states |
| `on-solid` | `#FFFFFF` | Crisp white text on solid Pink actions |

### Community Channels (Tracks)

| Channel | Covers | Light Solid | Light Text | Dark Text |
|---|---|---|---|---|
| **Code** | Software, web, mobile, AI/ML | `#2563EB` | `#1D4ED8` | `#93C5FD` |
| **Make** | Hardware, robotics, PCB, fabrication | `#EA580C` | `#C2410C` | `#FDBA74` |
| **Design** | UI/UX, product, visual, industrial | `#FA1681` | `#D10D69` | `#FF80BD` |
| **Research** | Deep-tech, space, bio, climate | `#7C3AED` | `#6D28D9` | `#C4B5FD` |
| **Earn** | Bounties, paid roles, grants, sprints | `#059669` | `#047857` | `#6EE7B7` |
| **Learn** | Roadmaps, courses, mentorship | `#0284C7` | `#0369A1` | `#7DD3FC` |

## Shape & Elevation

- **Buttons & Pills (`Button`, `Badge`, `Chip`, `FilterChip`, `SearchField`, `IconButton`):** Pill radius (`rounded-full`) for effortless social scanability.
- **Feed Cards & Side Panels (`Card`, `Panel`, `StatTile`):** Generous `rounded-2xl` (16px) corners with crisp `border-hairline` and delicate social lift (`shadow-xs` -> `shadow-module`).
- **Inputs & Code Blocks (`Input`, `Textarea`, `CodeBlock`):** Clean `rounded-xl` (12px) frames with `#FA1681` pink focus halo (`focus-visible:ring-accent/20`).

## Accessibility & DPDP Act 2023 Safety

- Minimum touch target height of 36–44px across controls.
- High-contrast accessible pink text token (`text-accent-fg`, `#D10D69` on white) achieves >5:1 WCAG AA contrast.
- **Zero Age Profiling:** Never display numeric age anywhere; only opt-in experience badges ("Student", "Maker", "Mentor").
