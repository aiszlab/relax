import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import pkg from './package.json' assert { type: 'json' }

const __filename = fileURLToPath(import.meta.url)

/** @type {import("webpack").Configuration} */
const configuration = {
  optimization: {
    minimize: true
  },

  mode: 'production',

  // 入口文件
  entry: './src/index.ts',

  // 输出文件
  output: {
    path: resolve(dirname(__filename), 'dist'),
    module: true,
    clean: true,
    library: {
      type: 'module'
    }
  },

  // loader
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },

  // 文件后缀
  resolve: {
    extensions: ['.ts', '.js']
  },

  externals: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        mode: 'write-dts'
      }
    })
  ],

  experiments: {
    outputModule: true
  }
}

export default configuration
