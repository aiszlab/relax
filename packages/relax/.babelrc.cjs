/**
 * @type {import("@babel/core").ConfigFunction}
 */
const config = (api) => {
  api.cache.never();

  return {
    presets: ["@babel/preset-env", "@babel/preset-typescript"],
  };
};

module.exports = config;
