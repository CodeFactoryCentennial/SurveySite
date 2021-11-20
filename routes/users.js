var express = require('express');
var passport = require('passport');
const { User } = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.render('user/login', { title: 'Login', activelogin: 'active', message: req.flash('error'), islogged: isLogged(req) });
});

router.get('/register', function (req, res, next) {
  res.render('user/registration', { title: 'Registration', activeregister: 'active', islogged: isLogged(req) });
});

router.get('/logout', function (req, res, next) {
  req.logOut();
  res.redirect('/users/login');
});

router.post('/register', function (req, res, next) {
  const name = req.body.codefactoryname;
  const email = req.body.codefactorysignupemail;
  const password = req.body.codefactorysignuppass;
  const password2 = req.body.codefactoryconfirmpass;

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'All fields are required' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' })
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    res.render('user/registration', {
      errors,
      name, email, password, password2,
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('user/registration', {
          errors,
          name, email, password, password2,
        });
      }
      else {
        const newUser = new User({
          name,
          email,
          password
        })
        newUser.save()
          .then(user1 => {
            passport.authenticate('local', (err, user) => {
              req.logIn(user1, (errLogIn) => {
                  if (errLogIn) {
                      return next(errLogIn);
                  }
                  return res.redirect('/dashboard');
              });
          })(req, res, next);
          })
          .catch(err => { console.log(err) });;
      }


    });
  }
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }),
  function (req, res) {
    res.redirect('/dashboard');
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
