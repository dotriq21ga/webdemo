const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const expressValidator = require('express-validator');
const passport = require('passport');
const config = require('dotenv').config();
const session = require('express-session');
const  MongoStore = require('connect-mongo');
const {MongoClient} = require('mongodb');
const app = express();
const port = 3000

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

mongoose.connect('mongodb+srv://mgoos:0965937622@cluster0.8ry6e.mongodb.net/container');

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store:  MongoStore.create({
    mongoUrl: 'mongodb+srv://mgoos:0965937622@cluster0.8ry6e.mongodb.net/container'
  })
}));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport Config
require('./middleware/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true}));
// parse application/json
app.use(express.json());

// load view engine
app.set('views',path.join(__dirname , 'views'))
app.set('views engine' , 'pug')

// Home Route
const {Option}= require('./models/option')
app.get('/', function (req, res) {
  Option.find({} ,  function (err, options){
    if (err) {
      console.log(err);
    } else {
      res.render('index.pug', {
        options : options
      })
    }
  })
})

let users = require('./routes/users');
let option = require('./routes/options');
let accounts = require('./routes/accounts');
let profice = require('./routes/profice')
let transaction = require('./routes/transaction')
let admin = require('./routes/admin');

app.use('/users', users);
app.use('/option', option);
app.use('/accounts', accounts);
app.use('/profice', profice);
app.use('/transaction',transaction);
app.use('/admin',admin);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})