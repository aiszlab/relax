import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["__test__/**/*.test.ts"],
    coverage: {
      include: ["src/**"],
      reporter: ["text", "json-summary"],
    },
  },
});
