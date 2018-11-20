var express = require('express');
var router = express.Router();

/* Router la requête HTTP GET vers la fonction callback  */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" }); // rendre une vue (pas indiquer le .ejs si view engine est définit) et envoyer une variable title à la vue
});


module.exports = router;
