const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
var bodyParser = require('body-parser')

//Json parser
app.use(bodyParser.json());

// Bodyparser
app.use(express.urlencoded({ extended: false }))

// Passport config (include)
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
   // cookie: { secure: true }
  }))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/register'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/validate'));


const PORT = process.env.port || 8080;

app.listen(PORT, console.log(`SERVER STARTED ON PORT: ${PORT}`));