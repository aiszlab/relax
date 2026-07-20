# Design: `toPercentage` Utility

## Overview

Add a `toPercentage` utility function to `@aiszlab/relax` that converts a ratio number (0–1) to a percentage string with a `%` suffix.

## API

```ts
toPercentage(value: number, digits?: number): string
```

- **`value`** — Ratio number (0–1), multiplied by 100 internally
- **`digits`** — Optional decimal places. When specified, `toFixed(digits)` is used for rounding. When omitted, natural stringification is used (no forced decimal places)

## Behavior

| Input | Output |
|---|---|
| `toPercentage(0)` | `"0%"` |
| `toPercentage(1)` | `"100%"` |
| `toPercentage(0.5)` | `"50%"` |
| `toPercentage(0.1234)` | `"12.34%"` |
| `toPercentage(0.12345, 2)` | `"12.35%"` |
| `toPercentage(0.12345, 0)` | `"12%"` |
| `toPercentage(-0.5)` | `"-50%"` |

Edge cases (natural JS behavior, no special handling):
- `NaN` → `"NaN%"`
- `Infinity` → `"Infinity%"`

## Implementation

### Source

**File:** `packages/relax/src/utils/to-percentage.ts`

```ts
/**
 * @description
 * convert a ratio number to a percentage string
 * @param value  — ratio number (0–1)
 * @param digits — optional decimal places, uses toFixed when specified
 * @returns percentage string with "%" suffix
 */
export const toPercentage = (value: number, digits?: number): string => {
  const percent = value * 100;
  return (digits === undefined ? String(percent) : percent.toFixed(digits)) + "%";
};
```

### Barrel export

**File:** `packages/relax/src/index.ts` — add in the utils section (alphabetical order, after `throttle`):

```ts
export { toPercentage } from "./utils/to-percentage";
```

### Test

**File:** `packages/relax/__test__/utils/to-percentage.test.ts`

Tests covering: basic conversion, natural stringification (no digits), fixed digits, zero, one boundary, negative values.
