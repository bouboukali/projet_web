var express = require('express');
var router = express.Router();
const db = require('../modules/db.js');
const jwtCheck = require('../modules/jwt.js');


/* process.env.AUTH0_CLIENT_ID */

router.post('/', jwtCheck.jwtCheck, (req, res) => {

    db.db.collection('users').insertOne(req.body).then((result) => {

        req.body._id = result.insertedId; // si on avait pas de req.body._id valide, alors il sera créé 
        res.json(req.body);

    }).catch((err) => {
        res.status(500).send(err);
    });


});
router.post('/session', function (req, res, next) {


    db.db.collection('users').findOne({ phone: req.body.phone})
        .then((user) => {
            console.log(user);
            res.json(user);
        }).catch((err) => {
            res.status(500).send(err);
        });
});

module.exports = router;
