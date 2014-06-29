var m = require('../../lib/middleware.js'),
    p = require('passport'),
    u = require('../../lib/users.js'),
    debug = require('debug')('api:user');

module.exports = function(app) {
  
  app.post("/api/user/new", function(req, res, next) {
    var user = req.body.user;
    if(typeof user.email === 'undefined' && typeof user.password === 'undefined'){
      res.json(400,{message: 'no email or password sent.'});
    }
    debug('email',validateEmail(user.email));
    if(!validateEmail(user.email)){
      res.json(400,{message: 'email is not a valid email.'});
    }
    debug('email',user.email);
    u.newUser(user,function(err, newUser) {
      if(err) {return next(err)}
      
      delete req.body;
      req.body = {username: user.email, password: user.password};

      p.authenticate('local', function(err, user) {
        debug('err',err);
        debug('user',user);
        if(err) {return next({status: 500, message: "An Error Occurred."});}

        if(!user){return next({status: 404,message: "Incorrect username or password"});}
        else {
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            user.password = null;
            delete user.password;
            res.json(user);
          });
        }

      })(req,res,next);
       
    });
    
  });

  app.put("/api/user/username", u.saveUsername, function(req, res, next) {
    res.json({username: req.username});
  });
  app.put("/api/user/password", u.savePassword, function(req, res, next) {
    res.json({password: req.password});
  });
  
}

function validateEmail(email) { 
    var re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return re.test(email);
} 