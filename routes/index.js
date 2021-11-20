var express = require('express');
const { Survey } = require('../models/Survey');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!isLogged(req)) {
    res.render('index', { title: 'Home', activehome: 'active', islogged: isLogged(req) });
  }
  res.redirect('/dashboard');
});

router.get('/dashboard', isAuthenticated, function (req, res, next) {
  var query = { userid: req.user._id };
  var mysort = { _id: -1 };
  Survey.find(query).sort(mysort).then((result) => {
    if (result.length > 0){
      res.render('dashboard', { title: 'Dashboard', activedash: 'active', islogged: isLogged(req), result });
    }
    res.render('dashboard', { title: 'Dashboard', activedash: 'active', islogged: isLogged(req) });
  });
  // res.render('dashboard', { title: 'Dashboard', activedash: 'active', islogged: isLogged(req) });
});

router.get('/createSurvey/:questions', isAuthenticated, function (req, res, next) {
  res.render('newsurvey', { title: 'Create a new Survey', numberOfQue: (Number(req.params.questions) + 1) })
});


router.post('/createSurvey/:questions', function (req, res, next) {

  const surveyquestions = [];
  for (var i = 1; i < Number(req.params.questions) + 1; i++) {
    const question = req.body[`que${i}label`];
    const options = [req.body[`que${i}option1`], req.body[`que${i}option2`], req.body[`que${i}option3`], req.body[`que${i}option4`]];
    const questionarray = {
      question: question,
      options: options
    }
    surveyquestions.push(questionarray);
  }
  const survey = {
    title: req.body.surveytitle,
    questions: surveyquestions
  };
  const newSurvey = new Survey({
    name: req.body.surveytitle,
    slug: convertToSlug(req.body.surveytitle),
    userid: req.user._id,
    useremail: req.user.email,
    questions: surveyquestions
  });
  newSurvey.save()
    .then(() => { res.redirect('/about/' + newSurvey._id) })
    .catch((err) => { res.send(err) });

});

function convertToSlug(Text) {
  return Text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

router.get('/about/:id', isAuthenticated, function (req, res, next) {
  Survey.findById(req.params.id)
    .then(data => {
      if (data) {
        console.log(req.user.email == data.useremail);
        if (req.user.email == data.useremail) {
          var noOfQues = 0;
          for (noOfQues; noOfQues < data.questions.length; noOfQues++) {

          }
          const date = new Date(data.date);
          res.render('aboutsurvey', { surveyData: data, islogged: true, noOfQues, date });
        }
        else {
          res.redirect('/dashboard');
        }
      } else {
        res.redirect('/dashboard');
      }
    })
    .catch(err => {
      res.redirect('/dashboard');
    });
});

router.post('/delete/:id', function (req, res, next) {
  Survey.findByIdAndRemove(req.params.id);
  res.redirect('/dashboard');
});

router.get('/underconstruction', function (req, res, next) {
  res.render('underconstruction');
});

function isAuthenticated(req, res, done) {
  if (req.user) {
    return done();
  }
  return res.redirect('/users/login')
  // return done();
}

function isLogged(req) {
  if (req.user) {
    return true;
  }
  return false;

  // return true;
}

module.exports = router;
