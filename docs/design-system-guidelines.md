# Hackerland Design System & Governance Guidelines

This document defines the statutory architectural standards and usage guidelines for the **Hackerland Mission Control Design System** (`@hackerland/ui`). Every contributor, engineer, and autonomous agent working on Hackerland must strictly follow these rules.

---

## 1. Dual-Theme Architecture: Dark (Default) & Solar Day Mode

Hackerland operates on an adaptive dual-theme engine:
- **Mission Control Dark (Default):** Space Navy (`#0A0E17`) canvas with Ion Cyan (`#00E5FF`) telemetry accents and Forge Amber (`#FF8A00`) highlights. Designed for late-night hacking, IDE focus, and makerspace ambient displays.
- **Solar Day Mode:** High-clarity daylight titanium (`#F4F7FC`) canvas, crisp white (`#FFFFFF`) surface cards, high-contrast text (`#0A0E17`, >13:1 contrast ratio), and solar teal accents (`#008B9E`). Engineered for outdoor testing, bright sunlight, and daylight hardware benches.

Theme state is synchronized via `data-theme="dark" | "light"` on `document.documentElement` and persisted in `localStorage['hackerland-theme']`.

---

## 2. The Zero Raw Hex Rule (MANDATORY)

> [!IMPORTANT]
> **Never write raw hex codes (`#0A0E17`, `#00E5FF`, `#FFFFFF`, etc.) or hardcoded utility colors (`bg-white`, `text-black`, `bg-gray-900`) in markup or components.**

All styling must consume semantic design tokens:

| Element | Semantic Tailwind Token | Resolves to (Dark) | Resolves to (Solar Day) |
|---|---|---|---|
| Root page background | `bg-canvas` | `#0A0E17` | `#F4F7FC` |
| Primary cards & panels | `bg-surface-1` | `#101726` | `#FFFFFF` |
| Raised modules & hover wells | `bg-surface-2` | `#182238` | `#E8EEF8` |
| Popovers, dialogs & modals | `bg-surface-3` | `#1C2842` | `#DCE5F5` |
| Input wells & codeblocks | `bg-sunken` | `#0D131F` | `#E7EDF7` |
| Subtle card & panel borders | `border-hairline` | `#1E2B45` | `#D0DBEB` |
| Interactive control borders | `border-line` | `#2A3B5E` | `#B5C6E0` |
| Primary high-contrast text | `text-fg` | `#F0F4FC` | `#0A0E17` |
| Secondary body & metadata | `text-fg-muted` | `#A9B6CC` | `#384A64` |
| Tertiary text & placeholders | `text-fg-subtle` | `#7D8DA8` | `#5D708E` |
| Primary interactive accent | `text-accent`, `bg-accent` | `#00E5FF` | `#008B9E` |
| Text on solid accent button | `text-on-solid` | `#060B12` | `#FFFFFF` |

---

## 3. Discipline Tracks & Tonal Accents

Every project, person, feed post, and bounty belongs to one of the 6 canonical tracks:

| Track | Theme Token | Dark Solid | Dark Text | Day Solid | Day Text |
|---|---|---|---|---|---|
| **Code** | `code` | `#00E5FF` | `#38E8FF` | `#008B9E` | `#007A8A` |
| **Make** | `make` | `#FF8A00` | `#FFA033` | `#EA580C` | `#C2410C` |
| **Design** | `design` | `#FF5FA2` | `#FF85B8` | `#DB2777` | `#BE185D` |
| **Research** | `research` | `#A970FF` | `#C29BFF` | `#7C3AED` | `#6D28D9` |
| **Earn** | `earn` | `#00F59B` | `#5CFFBA` | `#059669` | `#047857` |
| **Learn** | `learn` | `#4D9FFF` | `#7DB8FF` | `#2563EB` | `#1D4ED8` |

---

## 4. Typography Scale

- **Display & Headings:** `Space Grotesk` (`font-display`)
- **Body & UI Text:** `Inter` (`font-sans`, default)
- **Code & Telemetry:** `JetBrains Mono` (`font-mono`)
- **Numbers & Metrics:** Always add `tabular-nums` for counters, balances, and time stamps.
- **Capitalization:** Uppercase is restricted exclusively to `label-*` and status chips.

---

## 5. Mobile Responsiveness Guarantee (Down to 390px)

- Every container must include `min-w-0` to allow flex and grid items to shrink below content size.
- Long text, URLs, project titles, and descriptions must include `[overflow-wrap:anywhere]` or `break-words`.
- Playwright E2E suite verifies 0px horizontal overflow across all 30 routes at `390×844` viewport.

---

## 6. Child Safety & India DPDP Act 2023 Compliance

- **Zero Age Profiling:** Never prompt for, store, or display numerical age ("Age 16" is prohibited).
- **Experience Badges:** Use voluntary badges ("Student", "Maker", "Lab Lead", "Mentor").
- **Verifiable Parental Consent:** Under-18 makers register via SHA-256 parental consent hashes stored internally, keeping public profiles completely private from tracking and profiling.

---

## 7. Component Usage Example

```tsx
import { Card, CardHeader, CardBody, Badge, Button, StatTile } from '@hackerland/ui';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function FlightTelemetryCard() {
  return (
    <Card accent="make" className="min-w-0">
      <CardHeader className="flex justify-between items-center gap-2">
        <h3 className="font-display text-headline-sm text-fg break-words">
          Suborbital Sounding Rocket
        </h3>
        <Badge tone="make" variant="outline">
          Aerospace
        </Badge>
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-body-md text-fg-muted [overflow-wrap:anywhere]">
          Open hardware flight avionics running real-time Kalman filter telemetry.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <StatTile label="Apogee" value="12.4 km" hint="Target altitude" />
          <StatTile label="Bounty" value="₹50,000" hint="Milestone 2" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Button variant="primary">Apply for Role</Button>
          <ThemeToggle />
        </div>
      </CardBody>
    </Card>
  );
}
```
