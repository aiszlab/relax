const pkg = require("./package.json");

/**
 * @type {import("@babel/core").ConfigFunction}
 */
const config = (api) => {
  api.cache.never();

  return {
    presets: ["@babel/preset-env", "@babel/preset-typescript"],
    plugins: [["@babel/plugin-transform-runtime", { version: pkg.dependencies["@babel/runtime"] }]],
  };
};

module.exports = config;
