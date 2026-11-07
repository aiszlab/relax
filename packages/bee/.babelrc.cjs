const runtimeVersion = require("@babel/runtime/package.json").version;

/**
 * @type {import("@babel/core").ConfigFunction}
 */
const config = (api) => {
  api.cache.never();

  return {
    presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
    plugins: [["@babel/plugin-transform-runtime", { version: runtimeVersion }]],
  };
};

module.exports = config;
