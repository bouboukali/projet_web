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
    // Un chemin absolu du répertoire de base de notre projet utilisé pour résoudre le/les point(s) d'entré(s) et les loaders
    context: projectRoot,
    /* Un point d'entrée indique quel module webpack devrait utiliser pour commencer à construire son graphique de dépendance interne.
    *  entry: {
    *    leNomDuFichierDentree : son chemin
    *  }
    */
    entry: {
      application: './src/client/entries/application.js',
      auth0: './node_modules/auth0-js/build/auth0.js',
      auht0_lock: './node_modules/auth0-lock/lib/lock.js'
    },
    // Le resolver aide webpack à trouver le code du module pour chaque déclaration de require ou import
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      modules: ['node_modules', "src/client"]
    },
    output: {
      path: path.join(projectRoot, outputDirectory)/* /dist/ */,
      /*
        * Détermine le nom de chaque fichier bundle de sortie. Le bundle est écrit dans le dossier de path (/dist/).
        * Afin d'améliorer les performances côté navigateur il est important de configurer correctement la mise en cache des assets
        * JavaScript et CSS. En général, on indique aux navigateurs de mettre en cache les fichiers pour une très longue durée et on
        * change le nom du fichier à chaque mise à jour afin de forcer le rafraichissement de ce dernier.
        * Il va être possible d'indiquer à Webpack d'ajouter un hash dans le nom du fichier à chaque compilation (on ne le fait qu’en production).
        *
        * Il est à noter que cette option n'affecte pas les fichiers de sortie pour les morceaux (chunk) chargés sur demande (lazy-loading),
        * même chose pour les fichiers de sorties créés par des loaders. Pour cela, il faut utiliser l'option chunkfilename.
      */
      filename: isDevelopment ? '[name].js' : '[name]-[hash].js',
      chunkFilename: isDevelopment ? '[name].js' : '[name]-[hash].chunk.js',
      // L'URL de notre output.path du point de vue de la page HTML de notre navigateur
      // webpack-dev-server l'utilise aussi pour déterminer d'où servir les fichiers de sorties
      publicPath: isDevelopment ? '//localhost:3000/' : '/'
      // en developpement script src dans le <body> vaudra //localhost:3000/application.js
      // en production sur heroku <body> vaudra /application.js
      /* 
       * Nous exécutons 2 serveurs en développement : 

       * -	Un serveur de développement Webpack (localhost:3000) qui sert notre application React et
       *    qui surveille les changements de nos assets et compile tout à la volée càd met à jour
       *    (votre Javascript ? et le reste ?) sans recharger votre navigateur grâce au HMR (Hot Moduke Remplacement).
       * 
       * -	L’application Node+Express (serveur http, port 3030 --> voir www.js) qui sert notre API. 
       *
       * Le navigateur (utilisateur) communique exclusivement avec le serveur Webpack qui fait ensuite
       * des requêtes spécifiques (à l'API) à notre serveur API :
       */
    },
    module: {
      // Liste de nos loaders
      // Noter que les loaders sont exécutés en ordre inverse les premiers en dernier, en utilisant la sortie du suivant
      rules: [
        {
          // pour tous les fichiers qui finissent par js ou jsx
          test: /\.(js|jsx)$/,
          // ... en prenant bien soin d'exclure les node_modules (on suppose que les librairies dans node_modules gèrent ES5)
          exclude: /node_modules/,
          use: {
            // on ajoute le loader babel
            loader: 'babel-loader'
          }
        },
        {
          // pour tous les fichiers qui finissent par css
          test: /\.css$/,
          // on ajoute les loaders style et css
          use: ['style-loader', 'css-loader']
          /* de droite à gauche :
                 * D'abord il convertit le css de l'import en string (css-loader)
                 * Ensuite, cette chaine est injectée dans une balise style dans le <head></head> (style-loader)
                 */
        },
        {
          // pour tous les fichiers qui finissent par scss
          test: /\.scss$/,
          // on ajoute les loaders style et css et sass
          use: ['style-loader', 'css-loader', 'sass-loader']
          /* de droite à gauche même chose sauf que d'abord il compile le SASS en CSS grâce a Node Sass */
        },
        {
          // les fonts et les images
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000'
        }
      ]
    },
    devtool: 'inline-source-map',
    devServer: {
      /*
       * Active le Hot Module Replacement de webpack (voir explication dans les plugins).
       * Note that webpack.HotModuleReplacementPlugin is required to fully enable Hot Module Replacement.
       * If webpack or webpack-dev-server are launched with the --hot option, this plugin will be added automatically,
       * so you may not need to add this to your webpack.config.js.
      */
      hot: true,
      port: 3000 // Le dev-server va run sur http://localhost:3000/
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
        'process.env.AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN),
        'process.env.CALLBACK_URL_DEVELOPMENT': JSON.stringify(process.env.CALLBACK_URL_DEVELOPMENT),
        'process.env.CALLBACK_URL_PRODUCTION': JSON.stringify(process.env.CALLBACK_URL_PRODUCTION)
      })
    ]
  };
}

module.exports = buildConfig;