var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const helmet = require('helmet');
const flash = require('connect-flash');
const crypto = require("crypto");
const cookie = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');

const registerRouter = require('./routes/register');
const dashboardRouter = require('./routes/dashboard');

const session = require('express-session');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const dataSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: dataSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(flash());

app.use((req, res, next) => {
  const flashSuccessMessage = req.flash('success_msg');
  const cookieSuccessMessage = req.cookies.success_msg ? [req.cookies.success_msg] : [];
  res.locals.success_msg = [...flashSuccessMessage, ...cookieSuccessMessage];
  const flashErrorMessage = req.flash('error_msg');
  const cookieErrorMessage = req.cookies.error_msg ? [req.cookies.error_msg] : [];
  res.locals.error_msg = [...flashErrorMessage, ...cookieErrorMessage];
  res.clearCookie('success_msg');
  res.locals.user = req.session ? req.session.user : null;
  res.locals.isConnected = req.session && req.session.user ? true : false; 
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/dashboard', dashboardRouter);

app.get('/logout', (req, res) => {
  res.cookie("error_msg", "Vous êtes déconnecté !", { maxAge: 5000, httpOnly: true });
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


app.use(function(req, res, next) {
  next(createError(404, 'Not found.'));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log("Error :: " + err.message);

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
