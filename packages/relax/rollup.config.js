import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' }

const EXTENSIONS = ['.ts']

/**
 * @type {import("rollup").RollupOptions}
 */
const configuration = {
  input: {
    index: './src/index',
    'dom/index': './src/dom/index'
  },

  output: {
    format: 'es',
    dir: './dist',
    preserveModules: true,
    preserveModulesRoot: './src'
  },

  plugins: [
    resolve({
      extensions: EXTENSIONS
    }),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      extensions: EXTENSIONS
    })
  ],

  treeshake: {
    moduleSideEffects: false
  },

  strictDeprecations: true,

  external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]
}

export default configuration
