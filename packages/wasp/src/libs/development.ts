import { createServer } from "vite";
import configuration from "../configurations/vite.config.js";

export const development = async () => {
  const server = await (await createServer(configuration)).listen();
  server.printUrls();
};
