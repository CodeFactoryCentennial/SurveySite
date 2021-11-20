var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Passport
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require("connect-flash");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


var reload = require('reload');
const { User } = require('./models/User');
app.listen(3000, () => {
  console.log(`Listening on port 3000`);
})
reload(app);

// Passport Session holder
app.use(session({
  secret: 'codeFactorySecret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));
app.use(flash());


// BodyParser
app.use(express.json({ extended: true }));
app.use(express.urlencoded({
  extended: false
}))

app.use(passport.initialize());
app.use(passport.session());

// MongoDb setup
mongoose.connect("mongodb+srv://codefactorydb:centennialcollege@codefactorysurvey.cgpw0.mongodb.net/CodeFactorySurvey?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/stylesheets/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/'));


app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Passport
passport.use(new LocalStrategy({
  usernameField: 'codefactoryemail',
  passwordField: 'codefactorypassword'
},
  function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Email is not correct' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  if (user) {
    return done(null, user.id);
  }
  return done(null, false);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) return done(null, false);
    return done(null, user);
  })
});


function isAuthenticated(req, res, done) {
  if (req.user) {
    return done();
  }
  return res.redirect('/users/login')
}

module.exports = app;
