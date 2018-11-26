var express = require('express');
var router = express.Router();
const db = require('../modules/db.js');

var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://steep-sun-0991.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: "https://steep-sun-0991.eu.auth0.com/",
    algorithms: ['RS256']
});


/* process.env.AUTH0_CLIENT_ID */

// insert a new question
router.post('/', jwtCheck, (req, res) => {

    db.db.collection('users').insertOne(req.body).then((result) => {

        req.body._id = result.insertedId; // si on avait pas de req.body._id valide, alors il sera créé 
        res.json(req.body);

    }).catch((err) => {
        res.status(500).send(err);
    });


});

module.exports = router;
