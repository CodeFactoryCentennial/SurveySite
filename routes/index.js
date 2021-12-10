var express = require('express');
const { Survey } = require('../models/Survey');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!isLogged(req)) {
    res.render('index', { title: 'Home', activehome: 'active', islogged: isLogged(req) });
  } else {
    res.redirect('/dashboard');
  }

});

router.get('/dashboard', isAuthenticated, function (req, res, next) {
  var query = { userid: req.user._id };
  // var query = { useremail: "ksachde7@my.centennialcollege.ca" };
  var mysort = { _id: -1 };
  Survey.find(query).sort(mysort).then((result) => {
    if (result.length > 0) {
      res.render('dashboard', { title: 'Dashboard', activedash: 'active', islogged: isLogged(req), result });
    } else {
      res.render('dashboard', { title: 'Dashboard', activedash: 'active', islogged: isLogged(req) });
    }

  });
  // res.render('dashboard', { title: 'Dashboard', activedash: 'active', islogged: isLogged(req) });
});


router.get('/createSurvey/:questions', isAuthenticated, function (req, res, next) {
  res.render('newsurvey', { title: 'Create a new Survey', numberOfQue: (Number(req.params.questions) + 1) })
});

router.get('/createSurvey/:questions/:title', isAuthenticated, function (req, res, next) {
  res.render('newsurvey', { title: 'Create a new Survey', nameOfSurvey: String(req.params.title), numberOfQue: (Number(req.params.questions) + 1) })
});

router.post('/createSurvey/:questions', function (req, res, next) {

  const surveyquestions = [];
  const surveystatistics = [];
  for (var i = 1; i < Number(req.params.questions) + 1; i++) {
    const question = req.body[`que${i}label`];
    const options = [req.body[`que${i}option1`], req.body[`que${i}option2`], req.body[`que${i}option3`], req.body[`que${i}option4`]];
    const questionarray = {
      question: question,
      options: options
    }
    surveyquestions.push(questionarray);


    const surveyans = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    };
    const surveystat = {
      question: req.body[`que${i}label`],
      stat: surveyans
    };
    surveystatistics.push(surveystat);
  };

  const newSurvey = new Survey({
    name: String(req.body.surveytitle).substring(1),
    userid: req.user._id,
    useremail: req.user.email,
    questions: surveyquestions,
    statistics: surveystatistics,
    totalsubmissions: 0
  });
  newSurvey.save()
    .then(() => { res.redirect('/about/' + newSurvey._id) })
    .catch((err) => { res.send(err) });

});

router.post('/createSurvey', function (req, res, next) {
  var surveyname = req.body['survey-name'];
  var surveynumber = req.body['survey-number'];
  res.redirect(`/createSurvey/${surveynumber}/${surveyname}`)
});

function convertToSlug(Text) {
  return Text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

router.get('/about/:id', isAuthenticated, function (req, res, next) {
  Survey.findById(req.params.id)
    .then(data => {
      if (data != null) {
        // console.log(req.user.email == data.useremail);
        // if (req.user.email == data.useremail) {
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

router.get('/update/:id',isAuthenticated, function (req, res, next) {
  Survey.findById(req.params.id)
    .then(data => {
      if (data != null) {
        // console.log(req.user.email == data.useremail);
        // if (req.user.email == data.useremail) {
        if (req.user.email == data.useremail) {
          var noOfQues = 0;
          for (noOfQues; noOfQues < data.questions.length; noOfQues++) {

          }

          const date = new Date(data.date);
          res.render('editsurvey', { surveyData: data, islogged: true, noOfQues, date });
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

router.post('/update/:id/:questions', function (req, res, next) {
  const surveyquestions = [];
  for (var i = 1; i < Number(req.params.questions) + 1; i++) {
    const question = req.body[`que${i}label`];
    const options = [req.body[`que${i}option1`], req.body[`que${i}option2`], req.body[`que${i}option3`], req.body[`que${i}option4`]];
    const questionarray = {
      question: question,
      options: options
    }
    surveyquestions.push(questionarray);


  };

  Survey.findByIdAndUpdate(req.params.id, {
    name: req.body.surveytitle,
    questions: surveyquestions,
  }, (err, docs) => {
    if (!err) {
      res.redirect('/about/' + req.params.id);
    } else {
      res.send(err);
    }
  });
});

router.get('/github', function (req,res, next) {
  res.redirect('https://github.com/CodeFactoryCentennial/SurveySite');
});

router.get('/aboutproject', function (req,res, next) {
  res.render('aboutproject',{ islogged: isLogged(req) });
});

router.get('/delete/:id', isAuthenticated, function (req, res, next) {
  Survey.findByIdAndRemove(req.params.id, function (err, docs) {
    if (err) {
      res.send(err);
    }
    else {
      res.redirect('/dashboard');
    }
  });
  // res.redirect('/dashboard');
});

router.get('/underconstruction', function (req, res, next) {
  res.render('underconstruction');
});

router.get('/notfound', function (req, res, next) {
  res.render('notfound', { islogged: isLogged(req) });
});

router.get('/thankyou', function (req, res, next) {
  res.render('thankyou', { islogged: isLogged(req) });
});

router.post('/submitsurvey/:id', function (req, res, next) {

  Survey.findById(req.params.id, (err, data) => {
    const surveystatistics = [];
    for (var i = 1; i <= data.questions.length; i++) {
      var surveyans;
      if (req.body[`que${i}answer`] == 0) {
        surveyans = {
          0: data.statistics[i - 1].stat[0] + 1,
          1: data.statistics[i - 1].stat[1],
          2: data.statistics[i - 1].stat[2],
          3: data.statistics[i - 1].stat[3],
        };
      } else if (req.body[`que${i}answer`] == 1) {
        surveyans = {
          0: data.statistics[i - 1].stat[0],
          1: data.statistics[i - 1].stat[1] + 1,
          2: data.statistics[i - 1].stat[2],
          3: data.statistics[i - 1].stat[3],
        };
      } else if (req.body[`que${i}answer`] == 2) {
        surveyans = {
          0: data.statistics[i - 1].stat[0],
          1: data.statistics[i - 1].stat[1],
          2: data.statistics[i - 1].stat[2] + 1,
          3: data.statistics[i - 1].stat[3],
        };
      } else if (req.body[`que${i}answer`] == 3) {
        surveyans = {
          0: data.statistics[i - 1].stat[0],
          1: data.statistics[i - 1].stat[1],
          2: data.statistics[i - 1].stat[2],
          3: data.statistics[i - 1].stat[3] + 1,
        };
      };



      const surveystat = {
        question: data.questions[i - 1].question,
        stat: surveyans
      };
      surveystatistics.push(surveystat);

    };

    Survey.findByIdAndUpdate(req.params.id, {
      totalsubmissions: data.totalsubmissions + 1,
      statistics: surveystatistics

    }, (err, resp) => {
      if (!err) {
        res.redirect('/thankyou');
      } else {
        res.send(err);
      }
    });



  });





});

router.get('/:slug', function (req, res, next) {
  Survey.findOne({ slug: req.params.slug }, function (err, data) {
    if (data == null) {
      res.redirect('/notfound');
    } else {
      res.render('startsurvey', { title: data.name, data });
    }
  });
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
