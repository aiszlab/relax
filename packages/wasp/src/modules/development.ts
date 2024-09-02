import { createServer, defineConfig, mergeConfig } from "vite";
import React from "@vitejs/plugin-react";

export const development = async () => {
  const server = await createServer(
    mergeConfig(
      {},
      defineConfig({
        plugins: [React()],
      }),
    ),
  );

  await server.listen();
};
