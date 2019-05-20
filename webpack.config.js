const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = {
    entry: {
        'app': root('src/index.tsx'),
        'vendors': root('/src/vendors.ts')
    },
    output: {
        filename: "[name].js",
        publicPath: "/",
        path: root('dist'),
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
        plugins: [new TsConfigPathsPlugin()]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "common",
                    chunks: "initial",
                    minChunks: 2,
                    priority: 10,
                    reuseExistingChunk: true
                }
            }
        }
    },

    plugins: [
        new HtmlWebpackPlugin({ template: './index.html', inject: 'body' })
    ],

    // reduces output noise when running DEV env (webpack-dev-server)
  devServer: {
    historyApiFallback: true,
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: true,
      timings: true,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      children: false,
      cached: false,
      reasons: false
    },
  },
};

function root(args){
    const _root = path.resolve(__dirname);
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
};