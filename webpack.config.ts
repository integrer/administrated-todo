import path from 'path';
import { Configuration } from 'webpack';
import 'webpack-dev-server';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import cssnano from 'cssnano';

// noinspection ES6PreferShortImport
import { IS_DEV, WEBPACK_PORT } from './src/server/config';

const stableChunksRegEx = /^(main|vendors|material-ui)\.js$/;
const plugins = [
  new WebpackManifestPlugin({ filter: (file) => stableChunksRegEx.test(file.name) }),
  // new BundleAnalyzerPlugin(),
];

const targets = IS_DEV ? 'last 2 Firefox versions, last 2 Chrome versions, last 2 Edge versions' : '> 0.25%, not dead';

const config: Configuration = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV && 'inline-source-map',
  entry: ['./src/client/client'],
  output: {
    path: path.join(__dirname, 'dist', 'statics'),
    filename: `[name]-[chunkhash]-bundle.js`,
    chunkFilename: '[name]-[chunkhash]-bundle.js',
    publicPath: '/statics/',
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    minimize: !IS_DEV,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        material: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: 'material-ui',
          chunks: 'all',
          priority: 20,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/env', { modules: false, targets }], '@babel/react', '@babel/typescript'],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localsConvention: 'camelCase',
              sourceMap: IS_DEV,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: IS_DEV,
              plugins: IS_DEV ? [cssnano()] : [],
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|woff2|ttf|eot)$/,
        use: 'url-loader?limit=10000',
      },
    ],
  },
  ...(IS_DEV ? { devServer: { port: WEBPACK_PORT, open: false } } : null),
  plugins,
};

export default config;
