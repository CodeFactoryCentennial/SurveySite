var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard' });
});

router.get('/createSurvey', function(req, res, next) {
  res.redirect('/underconstruction');
});
router.get('/underconstruction', function(req, res, next) {
  res.render('underconstruction');
});

module.exports = router;
