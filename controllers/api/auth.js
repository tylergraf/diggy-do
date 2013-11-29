var m = require('../../lib/middleware.js'),
    u = require('../../lib/users.js'),
    p = require('passport'),
    debug = require('debug')('api:auth');

module.exports = function(app) {
  
  app.post("/api/login", function(req, res, next) {
    debug("req.body",req.body);
    // if(typeof req.body.username )
    // TODO: move this to middleware
    p.authenticate('local', function(err, user) {
      debug('err',err);
      debug('user',user);
      if(err) {res.json(500, {message: "An Error Occurred."});}

      if(!user){res.json(404, {message: "Incorrect username or password"});}
      else {
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          res.json({
            email: user.email,
            id: user.id
          });
        });
      }

    })(req,res,next)
  });

  app.post("/api/appLogin", function(req, res, next) {
    debug("req.body",req.body);

    u.findByEmail(req.body.email, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return next({status: 404, message: 'no user found'}); }

      if(req.body.id == user.id){
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          res.json({
            email: user.email,
            id: user.id
          });
        });
      } else {
        return next({status: 400, message: 'wrong id'})
      }
    });
  });

}