var express = require('express');
var router = express.Router();
const db = require('../modules/db.js');


// route GET api/messages/ qui renvoie tous les messages
// EXEMPLE : http://localhost:3030/api/messages/
router.get('/', function (req, res, next) {

  db.db.collection('messages').find().toArray().then((messages) => {

    res.json(messages);

  }).catch((err) => {
    res.status(500).send(err);
  });
});

// route POST api/messages/ qui insere un message
// L'ID (ObjectId) est ajouté automatiquement à chaque message, mais si on décide de le donner comme clé/valeur il doit être valide
/**
 * EXEMPLE : http://localhost:3030/api/messages/
 * 
 * POSTMAN : Body ---> x-www-form-urlencoded --> mettre clé(s)/valeur(s)
 * {
 *   "contenu": "Salut Flo comment ca va ?",
 *   "auteur": "charles"
 * }
 * 
 * Renvoie : {
 *   "contenu": "Salut Flo comment ca va ?",
 *   "auteur": "charles",
 *   "_id": "5bf06ad6edf0a94ba81070d5"
 * }
*/
router.post('/', function (req, res, next) {

  // db.ObjectID est un export de db.js
  if (req.body._id) {

    if (!db.ObjectID.isValid(req.body._id)) // un _id (ObjectId) must be a single String of 12 bytes or a string of 24 hex characters
      delete req.body._id;
  }

  // La db remplira result qui est un objet du type CommandResult
  // Cet objet contient une clé "insertedId" qui contient l'id de l'élément inséré
  db.db.collection('messages').insertOne(req.body).then((result) => {

    req.body._id = result.insertedId; // si on avait pas de req.body._id valide, alors il sera créé 
    res.json(req.body);

  }).catch((err) => {
    res.status(500).send(err);
  });
});

// route GET api/messages/:id qui renvoie le message dont l'id est donné en paramètre
/**
 * EXEMPLE : http://localhost:3030/api/messages/5bf072852645f270ac16b9f7
 * 
 * Renvoie : {
 *   "contenu": "Salut Flo comment ca va ?",
 *   "auteur": "charles",
 *   "_id": "5bf072852645f270ac16b9f7"
 * }
*/
router.get('/:id', function (req, res, next) {

  db.db.collection('messages').findOne({ _id: new db.ObjectID(req.params.id) }).then((message) => {

    res.json(message);

  }).catch((err) => {
    res.status(500).send(err);
  });
});


// route DELETE api/messages/:id qui supprime le message dont l'id est donné en paramètre
/**
 * EXEMPLE : http://localhost:3030/api/messages/5bf072852645f270ac16b9f7
 * 
 * Renvoie : {
 *   "contenu": "Salut Flo comment ca va ?",
 *   "auteur": "charles",
 *   "_id": "5bf072852645f270ac16b9f7"
 * }
*/
router.delete('/:id', function (req, res, next) {

  db.db.collection('messages').findOneAndDelete({ _id: new db.ObjectID(req.params.id) }).then((result) => {

    res.json(result.value);

  }).catch((err) => {
    res.status(500).send(err);
  });
});


// route PUT api/messages/:id qui met à jour le message dont l'id est donné en paramètre
/**
 * EXEMPLE : http://localhost:3030/api/messages/5bf072852645f270ac16b9f7
 * 
 * Renvoie : {
 *   "_id": "5bf072852645f270ac16b9f7",
 *   "contenu": "kksk",
 *   "auteur": "charles"
 * }
*/
router.put('/:id', function (req, res, next) {


  delete req.body._id;

  db.db.collection('messages').findOneAndUpdate({ _id: (new db.ObjectID(req.params.id)).toHexString() }, { $set: req.body }, { returnNewDocument: true }).then((result) => {

    res.json(result.value);

  }).catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
});

module.exports = router;
