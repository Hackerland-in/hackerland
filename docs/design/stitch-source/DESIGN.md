---
name: Aerospace Maker System
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353943'
  surface-container-lowest: '#0a0e17'
  surface-container-low: '#181b25'
  surface-container: '#1c1f29'
  surface-container-high: '#262a34'
  surface-container-highest: '#31353f'
  on-surface: '#dfe2ef'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dfe2ef'
  inverse-on-surface: '#2c303a'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#ffb77f'
  on-secondary: '#4e2600'
  secondary-container: '#ff8a00'
  on-secondary-container: '#613100'
  tertiary: '#f6e8ff'
  on-tertiary: '#470083'
  tertiary-container: '#e2c5ff'
  on-tertiary-container: '#7a29cb'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#ffdcc4'
  secondary-fixed-dim: '#ffb77f'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6f3900'
  tertiary-fixed: '#efdbff'
  tertiary-fixed-dim: '#dbb8ff'
  on-tertiary-fixed: '#2b0052'
  on-tertiary-fixed-variant: '#6600b7'
  background: '#0f131c'
  on-background: '#dfe2ef'
  surface-variant: '#31353f'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
  code-inline:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-precision, multi-generational innovation interface that bridges physical fabrication and bleeding-edge digital computation. The audience ranges from young self-taught roboticists and university researchers to veteran aerospace engineers and hardware tinkerers. The interface must communicate laboratory-grade rigor without feeling sterile or alienating.

The visual style blends **Aerospace Modernism** with **Tactile Workshop Culture**:
- **Aerospace Modernism:** Clean structural lines, high-density data readouts, razor-sharp status telemetry, and deep cosmic dark backdrops.
- **Collaborative Maker Spirit:** Warm energetic accents, physical assembly metaphors, high-contrast resource tags, and accessible tactile controls.

The emotional signature is empowering, disciplined, and forward-looking. Users should feel they are stepping into an orbital mission control room fused with an open-access skunkworks garage.

## Colors

The palette is engineered for visual stamina during extended engineering sessions, strict WCAG AAA contrast ratios, and intuitive domain categorization.

- **Neutral Canvas (`#0A0E17` Deep Space Navy):** Acts as the void/foundational surface. Elevated surfaces tier through `#101726` (surface base), `#182238` (surface raised), and `#22314E` (surface overlay), terminating in crisp structural borders (`#2A3B5E`).
- **Primary Accent (`#00E5FF` Ion Cyan):** Denotes computational operations, digital logic, telemetry links, AI inference, and interactive focus states.
- **Secondary Accent (`#FF8A00` Forge Amber):** Denotes physical fabrication, thermal states, rapid prototyping, 3D printing jobs, and active RFQs.
- **Tertiary Accent (`#7928CA` Deep Plasma):** Reserved for bio-tech, advanced quantum/deep-tech initiatives, and grant/scholarship highlights.
- **Functional Semantics:**
  - Success/Live: `#00F59B` (Telemetry Active / Print Ready)
  - Warning/Caution: `#FFD600` (Thermal Warning / Power Threshold)
  - Critical/Abort: `#FF334B` (Hardware Interruption / E-Stop)
  - Academic & Grant Indicators: Deep navy chip fills with crisp electric borders to preserve legibility for young and elder eyes alike.

## Typography

The type system balances technical precision with maximum accessibility across ages:
- **Headlines and Telemetry (`Space Grotesk`):** Provides a geometric, space-age presence with high character differentiation (avoiding confusion between `0` and `O`, `1` and `l`). All caps is permitted exclusively for `label-sm` badges and telemetry indices.
- **Reading and Operational UI (`Inter`):** Delivers clean readability for detailed schematics, curriculum walkthroughs (e.g. MIT OCW, NPTEL modules), and technical specs. Generous line heights preserve readability for seniors and young students alike.
- **Numeric Figures:** Always enable tabular figures (`font-variant-numeric: tabular-nums`) for real-time telemetry counters, sensor feeds, 3D printer temperatures, and cost estimations.

## Layout & Spacing

The system runs on a modular command-center layout powered by a strict 4px/8px incremental rhythm:

- **Desktop Layout:** 12-column dynamic fluid grid with a 1440px default max-width container, 24px (`1.5rem`) gutters, and 48px (`3rem`) screen margins. Side-docked inspector panels and schematic viewports lock to fixed fractional subdivisions (e.g., 3-col telemetry, 6-col CAD viewer, 3-col bill of materials).
- **Tablet Layout:** 8-column grid with 16px (`1rem`) gutters and 24px margins. Dual-pane command layouts fold gracefully into tabbed inspect panels.
- **Mobile Layout:** 4-column grid with 12px gutters and 16px margins. Telemetry panels dock to a bottom sheet; high-priority controls gain sticky accessibility.
- **Rhythm Rules:** Component internal paddings match `space-md` for standard cards and `space-lg` for project containers. Micro-controls and metadata tags use strictly `space-xs` and `space-sm` for unified alignment.

## Elevation & Depth

Visual hierarchy uses a hybrid of **Tonal Layering** and **Aerospace HUD Glows**:

- **Ground (Level 0):** Pure dark space backdrop `#0A0E17`. Houses structural layout divisions and base canvas.
- **Deck Surfaces (Level 1):** `#101726` with a hairline stroke (`1px solid #1E2B45`). Used for workspace containers, project grids, and passive feed cards.
- **Active Modules (Level 2):** `#182238` paired with ambient atmospheric shadows: `0 8px 24px -4px rgba(0, 0, 0, 0.6)`. Outlines elevate to `rgba(0, 229, 255, 0.2)` on hover.
- **Flight Overlays & Popovers (Level 3):** `#1C2842` surrounded by high-relief edge lighting (`1px solid rgba(255, 255, 255, 0.12)`) and deep shadow `0 16px 40px -8px rgba(0, 0, 0, 0.85)`.
- **Laser Accents & Focus Emissive States:** Interactive elements drop low-spread neon halos rather than muddy drop-shadows (e.g., Ion Cyan: `0 0 16px rgba(0, 229, 255, 0.35)`; Forge Amber: `0 0 16px rgba(255, 138, 0, 0.4)`).

## Shapes

The interface embraces a **machined, precision-tooled aesthetic** (Soft: `0.25rem` / `4px` baseline):
- **Base Components (Inputs, Small Tags, Telemetry Cells):** `0.25rem` border radius gives an engineered, laser-cut feel while remaining friendly and ergonomic.
- **Cards, Code Viewports, Hardware Cards:** `0.5rem` (`rounded-lg`).
- **Modal Dialogs & Command Bars:** `0.75rem` (`rounded-xl`).
- **Interactive Badges / Micro-Pills:** Strictly geometric with subtle chamfered corners or controlled 4px rounding to ensure high density without visual clutter.

## Components

### Buttons
- **Primary Flight Action:** Ion Cyan background (`#00E5FF`), deep obsidian typography (`#060B12`), font-weight 600, `0.25rem` radius. On hover: emissive glow `0 0 18px rgba(0, 229, 255, 0.5)`. Active: micro-scale to `0.98`.
- **Fabrication / RFQ Action:** Forge Amber background (`#FF8A00`), obsidian text, engineered for tangible hardware execution commands (e.g., "Submit RFQ", "Start 3D Slice").
- **Secondary / Ghost:** Transparent base, `1px solid #2A3B5E` border, crisp white text. On hover: border tints to `#00E5FF`, surface shifts to `rgba(0, 229, 255, 0.08)`.
- **Tactile Feedback:** Minimum touch target size is 44px across all screen sizes to guarantee usability for both young children and older adults.

### Badges & Metadata Tags
- **High-Contrast Data Badges:**
  - *Academic/Open Courseware (MIT OCW, NPTEL, Coursera):* Deep indigo-slate fill (`#131B2E`), bright electric border (`1px solid #3B82F6`), crisp text.
  - *Fabrication Badges (3D Print, CNC, Hardware RFQ):* Rich amber-tint fill (`#2A1A05`), border (`1px solid #FF8A00`), text `#FFA033`.
  - *Space Tech / Robotics:* Cyan-tint fill (`#041E26`), border (`1px solid #00E5FF`), text `#38E8FF`.
  - *Free / Grant / Scholarship:* Deep emerald fill (`#042116`), border (`1px solid #00F59B`), text `#5CFFBA`.
- Badges feature monospace-style uppercase tracking (`label-sm`), fixed height of 22px, and 8px horizontal padding.

### Cards & Modular Cells
- Constructed with `#101726` base, surrounded by high-precision `1px solid #1E2B45` borders.
- Hover behavior introduces a top-border highlight accent (a 2px gradient line of Ion Cyan or Forge Amber) that signals physical interactivity without content shifting.
- Top-right slot reserved for hardware status, academic origin tag, or RFQ readiness flags.

### Input Fields & Controls
- **Inputs & Search:** Deep background (`#0D131F`), inset border `1px solid #23314B`, text `#F0F4FC`. On focus: border shifts directly to `#00E5FF` with a subtle `0 0 0 1px #00E5FF` keyline. Placeholder text set to `#5A6E8C`.
- **Checkboxes & Radios:** Precision squares with `2px` corners and circular radios. Unchecked: `1.5px solid #364B6F`. Checked: Ion Cyan solid fill with obsidian glyph check.
- **Sliders (Hardware Parameter Tuning):** Track height 4px in `#1E2B45`, thumb diameter 18px with metallic center and `#00E5FF` border.

### Command Center Panels (Domain-Specific)
- **CAD/Schematic Viewport Panel:** Darkened canvas with coordinate markings along margins (`X/Y/Z` telemetry in cyan/amber/emerald).
- **BOM (Bill of Materials) & RFQ Tracker:** Tabular ledger layout with compact vertical padding (`space-xs`), real-time stock and machining availability indicators (laser cut, SLA print, PCB fabrication).