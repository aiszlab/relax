import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");
const EXTENSIONS = [".ts"];

/**
 * @type {import("rollup").RollupOptions}
 */
const configuration = {
  input: ["src/index", "src/dom/index"],

  output: {
    format: "es",
    dir: "dist",
    preserveModules: true,
    preserveModulesRoot: "src",
  },

  plugins: [
    resolve({
      extensions: EXTENSIONS,
    }),
    typescript(),
    babel({
      babelHelpers: "runtime",
      extensions: EXTENSIONS,
    }),
  ],

  treeshake: {
    moduleSideEffects: false,
  },

  strictDeprecations: true,

  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
    /@babel\/runtime/,
    /@aiszlab\/relax/,
  ],
};

export default configuration;
