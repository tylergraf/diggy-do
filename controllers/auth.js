var m = require('../lib/middleware.js'),
    p = require('passport'),
    debug = require('debug')('controllers:auth');

module.exports = function(app) {

  // app.get("/login", function(req, res, next) {
  //   res.render('login');
  // });

  app.post("/login", function(req, res, next) {
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
          res.redirect('/');
        });
      }

    })(req,res,next)
  });

}