import { createServer } from "vite";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export const development = () => {
  const server = createServer();
};
