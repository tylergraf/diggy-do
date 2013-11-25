
/*
* deps
*/
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    u = require('./users.js'),
    bcrypt = require('bcrypt'),
    FACEBOOK_APP_ID = "221940774496427",   
    FACEBOOK_APP_SECRET = "4d1783cda2bb7607052df25a6a79d85a",
    debug = require('debug')('middleware:middleware');



exports.auth = function(req, res, next){
  // console.log('req.isAuthenticated',req.isAuthenticated());
  // console.log('req.session',req.session);
  if (req.isAuthenticated()) { 
    return next(); 
  } else {
    req.session.redirect_to = req.path;
    res.redirect('/login')
  }
  
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  u.findById(id, function (err, user) {
    done(err, user);
  });
});



// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a done with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    doneURL: "http://localhost:3000/auth/facebook/done"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));



  // Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a email and password), and invoke a done
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(email, password, done) {
    // asynchronous verification, for effect...
      // Find the user by email.  If there is no user with the given
      // email, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      debug('email',email);
      debug('password',password);

      u.findByEmail(email, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, null); }
        bcrypt.compare(password, user.password, function(err, res) {
          if(err || !res){
            return done(err);
          } else {
            return done(null, user);
          }
        });
      })
  }
));

