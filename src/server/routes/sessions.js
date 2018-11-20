var express = require('express');
var router = express.Router();
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




module.exports = router;