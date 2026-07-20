# toPercentage Utility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `toPercentage` utility to `@aiszlab/relax` that converts a ratio (0–1) to a percentage string.

**Architecture:** Single utility function in `src/utils/to-percentage.ts`, re-exported from the main barrel `src/index.ts`. No dependencies on other utils or types.

**Tech Stack:** TypeScript, Vitest

## Global Constraints

- Follow existing coding patterns: `export const` with JSDoc `@description`
- Tests in `__test__/utils/`, import from `../../src`
- No `git commit` without explicit user permission

---

### Task 1: Write the source file

**Files:**
- Create: `packages/relax/src/utils/to-percentage.ts`

**Interfaces:**
- Produces: `toPercentage(value: number, digits?: number): string`

- [ ] **Step 1: Create `to-percentage.ts`**

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

- [ ] **Step 2: Verify the file exists and has correct content**

```bash
cat packages/relax/src/utils/to-percentage.ts
```

---

### Task 2: Add barrel export

**Files:**
- Modify: `packages/relax/src/index.ts`

**Interfaces:**
- Consumes: `toPercentage` from `./utils/to-percentage`

- [ ] **Step 1: Add export line in the utils section of `src/index.ts`**

Insert after the `throttle` export (line 93):

```ts
export { toPercentage } from "./utils/to-percentage";
```

The resulting utils section should include:

```ts
export { throttle } from "./utils/throttle";
export { toPercentage } from "./utils/to-percentage";
export { clone } from "./utils/clone";
```

---

### Task 3: Write tests

**Files:**
- Create: `packages/relax/__test__/utils/to-percentage.test.ts`

**Interfaces:**
- Consumes: `toPercentage` from `../../src`

- [ ] **Step 1: Create the test file**

```ts
import { toPercentage } from "../../src";

describe("`toPercentage` util", () => {
  it("natural stringification without digits", () => {
    expect(toPercentage(0)).toBe("0%");
    expect(toPercentage(1)).toBe("100%");
    expect(toPercentage(0.5)).toBe("50%");
    expect(toPercentage(0.1234)).toBe("12.34%");
  });

  it("fixed decimal places with digits", () => {
    expect(toPercentage(0.12345, 2)).toBe("12.35%");
    expect(toPercentage(0.12345, 0)).toBe("12%");
    expect(toPercentage(0.6666, 1)).toBe("66.7%");
  });

  it("negative value", () => {
    expect(toPercentage(-0.5)).toBe("-50%");
    expect(toPercentage(-0.1234, 1)).toBe("-12.3%");
  });
});
```

- [ ] **Step 2: Run the tests**

```bash
cd packages/relax && npx vitest run __test__/utils/to-percentage.test.ts
```

Expected: all 3 tests pass.

- [ ] **Step 3: Run the full test suite to check no regressions**

```bash
cd packages/relax && npx vitest run
```

Expected: all tests pass, no failures.
