import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");
const EXTENSIONS = [".ts"];

/**
 * @type {import("rollup").OutputOptions[]}
 */
const OUTPUS = [
  {
    format: "esm",
    entryFileNames: "[name].mjs",
  },
  {
    format: "commonjs",
    entryFileNames: "[name].cjs",
  },
];

/**
 * @type {import("rollup").RollupOptions}
 */
const configuration = {
  input: ["src/avatar/index", "src/color/index", "src/crypto/index", "src/path/index"],

  output: OUTPUS.map((_output) => ({
    ..._output,
    dir: "dist",
    preserveModules: true,
    preserveModulesRoot: "src",
  })),

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

  // use regexp to external dependencies
  // like `@aiszlab/relax`, we may use `@aiszlab/relax/dom` as submodule
  external: [...Object.keys(pkg.dependencies)].map((dependency) => new RegExp(`^${dependency}`)),
};

export default configuration;
