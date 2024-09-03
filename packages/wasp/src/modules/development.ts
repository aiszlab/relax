import { createServer, defineConfig, mergeConfig } from "vite";
import react from "@vitejs/plugin-react";

const PORT = 9527;

export const development = async () => {
  const server = await (
    await createServer(
      mergeConfig(
        {},
        defineConfig({
          plugins: [react()],
        }),
      ),
    )
  ).listen(PORT);

  server.printUrls();
};
