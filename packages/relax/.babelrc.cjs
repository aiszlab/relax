/**
 * @type {import("@babel/core").ConfigFunction}
 */
const config = (api) => {
  console.log('1111')

  api.cache.never()

  return {
    presets: ['@babel/preset-env', '@babel/preset-typescript']
  }
}

module.exports = config
