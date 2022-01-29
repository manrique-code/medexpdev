var express = require("express");
var router = express.Router();

// Endpoints = rutas por donde pedimos información.

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.status(200).json({
    version: "1.0",
    application: "medex backend",
  });
});

module.exports = router;
