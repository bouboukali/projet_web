const createError = require('http-errors');
const express = require('express');
var cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const assetPath = require('./asset_path.js');

const db = require('./modules/db.js');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');
const sessionsRouter = require('./routes/sessions');

const jwtSecret = process.env.JWT_SECRET;
// __dirname = // C:\Users\Florian\OneDrive - Haute Ecole Léonard de Vinci\IPL\3BIN flo\Web 3\react udemy final\src\server
const projectRoot = path.join(__dirname, '../..');
const serverRoot = path.join(__dirname, '.');

const app = express();
app.use(cors()); // add the CORS middleware so that our Express server can handle requests from different origins.
/*Nawfal a commit.*/

// Connect to DB, and insert default user if necessary
db.connect().then((db) => {
  let collection = db.collection('users');
  collection.countDocuments().then((res) => {
    if (res === 0) {
      collection.insertOne({
        login: 'laurent',
        password: 'laurent',
        firstName: 'Laurent',
        lastName: 'Leleux'
      }).catch((err) => {
        console.log('[App] Unable to insert default user');
      });
    }
  })
});

// The app.locals object has properties that are local variables within the application.
// sera accédée dans la balise script de index.ejs
app.locals.assetPath = assetPath;

// on assigne le chemin C:\Users\Florian\OneDrive - Haute Ecole Léonard de Vinci\IPL\3BIN flo\Web 3\react udemy final\src\server\views
// à la clé views, qui sera accessible via app.get('view')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger("dev")); // format dev = affichera une couleur en fonction de l'état de la requête HTTP (voir terminal)
app.use(express.json()); // It parses incoming requests with JSON payloads and is based on body-parser
app.use(express.urlencoded({ extended: false })); // It parses incoming requests with urlencoded payloads and is based on body-parser
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.

// Un fichier Sass aura pour extension .scss (anciennement .sass dont la syntaxe était plus éloignée de CSS)
// ce fichier va être compilé en css grâce au préprocesseur de Sass obtenu via le node sass middleware
app.use(
  sassMiddleware({
    src: path.join(serverRoot, 'public'),
    dest: path.join(serverRoot, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);

/* Notre css et notre js et nos images ne se trouvent pas dans le dossier public ni dans le dossier dist (pour l’instant on a qu’un
 * fichier manifest.json). Dès lors, ces 2 instructions ne servent à rien pour l’instant. 
 * Généralement, sur le squelette du générateur express, un dossier public est créé avec 3 dossiers à l'inétrieur :
 * - images
 * - javascripts
 * - stylesheets
 * 
 * Mais dans notre application, les assets sont distribués autrement. 
 */
app.use(express.static(path.join(__dirname, 'public'))); // servir les assets statiques (css (.sccs compilé en css grâce au sass middleware))
app.use(express.static(path.join(__dirname, '../../dist'))); // servir les assets statiques (JS, images) indiqués dans le manifest

app.use('/', indexRouter); // sur le chemin / appelle le callback correspondant à l'objet indexRouter (qui contient la fonction router.get)
app.use('/api/users', usersRouter); // sur le chemin /users appelle le callback correspondant à usersRouter (qui contient la fonction router.get)
app.use('/api/messages', messagesRouter);
app.use('/api/sessions', sessionsRouter);



const db = require('../modules/db.js');
const jwt = require('jsonwebtoken');

router.post('/', function (req, res, next) {


    if (!req.body.email || !req.body.password) {
        res.status(400).send("You ned an email and a password");
        return;
    }


    db.db.collection('users').findOne({ email: req.body.email, password: req.body.password })
        .then((message) => {

            const token = jwt.sign({
                id: message._id,
                login: message.login


            }, "mysupersecretkey", { expiresIn: "3 hours" });

            const c = {
                jwt: token
            };
            res.json(c);
            //console.log(message)
            // res.json(message);
        }).catch((err) => {
            res.status(500).send(err);
        });
});







/* Si les fonctions middlewares (function(req, res, next) de la méthode HTTP get) des callbacks indexRouter et usersRouter ne terminent pas 
 * le cycle de demande-réponse, alors elles appellent la fonction next() pour transmettre le contrôle à la fonction middleware suivante.
*/
// alors c'est une 404 (ressource n'existe pas) et on forward au gestionnaire d'erreur
app.use((req, res, next) => {
  next(createError(404));
});


// gestionnaire d'erreur
app.use((err, req, res, next) => {
  // res.locals = An object that contains response local variables scoped to the request, and therefore available only to the view(s)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // l'erreur est enregistrée seulement en développement

  // Sets the HTTP status for the response
  res.status(err.status || 500); // en dev : err, en production : 500 (erreurs serveur)
  res.render('error'); // rendre une vue (pas indiquer le .ejs si view engine est définit)
});

module.exports = app;
