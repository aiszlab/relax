import { createServer, defineConfig, mergeConfig } from "vite";
import react from "@vitejs/plugin-react";

export const development = async () => {
  const server = await createServer(
    mergeConfig(
      {},
      defineConfig({
        plugins: [react()],
      }),
    ),
  );

  await server.listen(8800);

  console.log("启动成功");
};
