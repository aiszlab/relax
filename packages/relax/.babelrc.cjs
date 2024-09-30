const pkg = require("./package.json");

/**
 * @type {import("@babel/core").ConfigFunction}
 */
const config = (api) => {
  api.cache.never();

  // README: current package why add @babel/preset-react
  // in unit tests, use jsx, need convert to js
  return {
    presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
    plugins: [["@babel/plugin-transform-runtime", { version: pkg.dependencies["@babel/runtime"] }]],
  };
};

module.exports = config;
