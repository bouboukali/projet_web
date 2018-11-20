var express = require('express');
var router = express.Router();
const db = require('../modules/db.js');

// correspond à http://localhost:3030/api/users/current
// Renvoie un user de la DB (il n'y en a qu'un seul)
// {"_id":"5bead9d08acb503e48fc44e4","login":"laurent","password":"laurent","firstName":"Laurent","lastName":"Leleux"}
router.get('/current', function (req, res, next) {
  db.db.collection('users').findOne().then((user) => {
    res.json(user);
  });
});

module.exports = router;
