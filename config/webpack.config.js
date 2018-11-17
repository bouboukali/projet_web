const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const Dotenv = require('dotenv-webpack');


const outputDirectory = 'dist';
const projectRoot = path.resolve(__dirname, '..');

function buildConfig(env, argv) {
  const isDevelopment = (argv.mode === 'development');

  return {
    name: 'base',
    context: projectRoot,
    entry: {
      application: './src/client/entries/application.js',
      auth0: './node_modules/auth0-js/build/auth0.js'
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      modules: ['node_modules', "src/client"]
    },
    output: {
      path: path.join(projectRoot, outputDirectory),
      filename: isDevelopment ? '[name].js' : '[name]-[hash].js',
      chunkFilename: isDevelopment ? '[name].js' : '[name]-[hash].chunk.js',
      publicPath: isDevelopment ? '//localhost:3000/' : '/'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000'
        }
      ]
    },
    devtool: 'inline-source-map',
    devServer: {
      hot: true,
      port: 3000
    },
    plugins: [
      new CleanWebpackPlugin([outputDirectory]),
      new ManifestPlugin({
        writeToFileEmit: true
      }),
      new webpack.HotModuleReplacementPlugin(),

      new Dotenv({

        safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
        systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
        silent: true // hide any errors
      }),

      // The DefinePlugin allows you to create global constants which can be configured at compile time.
      // Va permettre d'avoir accès aux variables d'environnements (.env) dans notre fontend 
      // https://medium.com/@trekinbami/using-environment-variables-in-react-6b0a99d83cf5
      new webpack.DefinePlugin({

        'process.env.AUTH0_CLIENT_ID': JSON.stringify(process.env.AUTH0_CLIENT_ID),
        'process.env.AUTH0_CLIENT_SECRET': JSON.stringify(process.env.AUTH0_CLIENT_SECRET),
        'process.env.AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN)
      })
    ]
  };
}

module.exports = buildConfig;