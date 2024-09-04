import { createServer } from "vite";
import configuration from "../configurations/vite.config.js";

const PORT = 9527;

export const development = async () => {
  const server = await (await createServer(configuration)).listen(PORT);
  server.printUrls();
};
