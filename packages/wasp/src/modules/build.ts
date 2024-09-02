import { build as _build, defineConfig, mergeConfig } from "vite";
import React from "@vitejs/plugin-react";

export const build = async () => {
  await _build(
    mergeConfig(
      {},
      defineConfig({
        plugins: [React()],
      }),
    ),
  );
};
