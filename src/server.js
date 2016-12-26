var express = require('express');
var fs = require('fs');
var gm = require('gm');
var passport = require('passport');
var request = require('request');
var rollbar = require('rollbar');
var tmp = require('tmp');
var validator = require('validator');
var InstagramStrategy = require('passport-instagram').Strategy;

var config = require('./config');

var INSTAGRAM_CLIENT_ID = config.instagram.clientID;
var INSTAGRAM_CLIENT_SECRET = config.instagram.clientSecret;
const GEOMETRY_FORMAT = '128x128+0+0';

const Cache = require('./cache');
const Timer = require('./timer');
const cache = new Cache(new Timer(100000));

if (!INSTAGRAM_CLIENT_ID || !INSTAGRAM_CLIENT_SECRET) {
  console.log('Instagram client ID and secret must be specified in config');
  process.exit(1);
}

// rollbar.init(config.rollbar.serversideToken);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new InstagramStrategy({
    clientID: INSTAGRAM_CLIENT_ID,
    clientSecret: INSTAGRAM_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Instagram profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Instagram account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();
app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('express-session')({
  secret: config.express.sessionSecret
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  request(req.user._json.data.profile_picture).pipe(res);
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.post('/montage', function(req, res, next) {
  if (Array.isArray(req.body) &&
        req.body.every(i => validator.isURL(i)) &&
        req.body.length >= 2) {
    return next();
  } else {
    res.sendStatus(400);
  }
}, function(req, res) {
  const photos = req.body;
  const photoStreams = photos.map((item) => {
    const cacheItem = cache.get(item);
    if (cacheItem) {
      return Promise.resolve(cacheItem);
    } else {
      return new Promise((resolve, reject) => {
        const tmpName = tmp.tmpNameSync();
        request(item).on('end', (response) => {
            cache.set(item, tmpName);
            return resolve(tmpName);
          })
          .pipe(fs.createWriteStream(tmpName));
      });
    }
  });

  Promise.all(photoStreams).then(photoStreams => {
    var tmpMontageName = `${tmp.tmpNameSync()}.png`;
    photoStreams.reverse();
    var callChain = gm(photoStreams[0])
    for (var i = 1; i < photoStreams.length; i++) {
      callChain = callChain.montage(photoStreams[i]);
    }
    callChain.geometry(GEOMETRY_FORMAT)
    .write(tmpMontageName, (err) => {
      if (err) {
        console.log(`Error generating image: ${err}`);
        return res.status(500).send(err);
      }
      res.setHeader('Content-Type', 'image/png');
      fs.createReadStream(tmpMontageName).pipe(res);
    });
  });
});

// GET /auth/instagram
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Instagram authentication will involve
//   redirecting the user to instagram.com.  After authorization, Instagram
//   will redirect the user back to this application at /auth/instagram/callback
app.get('/auth/instagram',
  passport.authenticate('instagram'),
  function(req, res){
    // The request will be redirected to Instagram for authentication, so this
    // function will not be called.
  });

// GET /auth/instagram/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Rollbar error handler: should occur after other handlers
function errorHandler (err, req, res, next) {
  console.log('Reporting error', err);
  console.log(err.stack);
  // rollbar.reportMessage(JSON.stringify(err));
  next();
}
app.use(errorHandler);

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
});
