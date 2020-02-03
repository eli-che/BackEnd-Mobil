const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
var bodyParser = require('body-parser');
const redisStore = require('connect-redis')(session);	

// Snow-flake generation, time sortable.
const { simpleflake } = require('simpleflakes');
// DB Config
const client = require('./config/keys');
const redis_client = require('./config/redis');


//Error Handler / Crash Handler
process.on('uncaughtException', function(ex) {
  // Prevent Crash;
  console.log("Crash");
  console.log(ex);
});


//Json parser
app.use(bodyParser.json());

// Bodyparser
app.use(express.urlencoded({ extended: false }))

// Passport config (include)
require('./config/passport')(passport);


// Express Session
app.use(session({
    store: new redisStore({ host: 'localhost', port: 6379, client: redis_client}),
    secret: 'dev-app',
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
app.use('/', require('./routes/friendrequest'));
app.use('/', require('./routes/friendchat'));
app.use('/', require('./routes/media'));


const PORT = process.env.port || 8080;

app.listen(PORT, console.log(`SERVER STARTED ON PORT: ${PORT}`));