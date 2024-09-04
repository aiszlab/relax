import { build as _build } from "vite";
import configuration from "../configurations/vite.config.js";

export const build = async () => {
  await _build(configuration);
};
