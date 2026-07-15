import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["__test__/**/*.test.ts", "__test__/**/*.test.tsx"],
  },
});
