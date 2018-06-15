const webpack = require('webpack');
const path = require('path');

let config = module.exports = {
  entry: './tools/doc/vue/main.ts',
  output: {
    path: path.join(__dirname, '../../../doc/dist'),
    publicPath: "/dist/",
    filename: 'main.js'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
    },
    extensions: ['.ts', '.vue', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Don't use tsconfig in package root since this just for documentation
            context: __dirname,
            configFile: 'tsconfig.vue.json',
            // Make sure .vue files are processed as well
            appendTsSuffixTo: [/\.vue$/],
          }
        }
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
      new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/])
  ]
};

// FIXME handle dev vs production build instructions