var m = require('../../lib/middleware.js'),
    p = require('passport'),
    u = require('../../lib/users.js'),
    debug = require('debug')('api:user');

module.exports = function(app) {
  
  app.post("/api/user/new", function(req, res, next) {
    var email = req.body.email,
        password = req.body.password;
    if(typeof email === 'undefined' && typeof password === 'undefined'){
      res.json(400,{message: 'no email or password sent.'});
    }
    debug('email',validateEmail(email));
    if(!validateEmail(email)){
      res.json(400,{message: 'email is not a valid email.'});
    }
    debug('email',email);
    u.newUser(email,password,function(err, user) {
      if(err) {res.json(409,{message: err});}
      
      else {
        p.authenticate('local', function(err, user) {
          debug('err',err);
          debug('user',user);
          if(err) {res.json(500, {message: "An Error Occurred."});}

          if(!user){res.json(404, {message: "Incorrect email or password"});}
          else {
            res.json(user);
          }

        })(req,res,next)
      }
    });
    
  });

}

function validateEmail(email) { 
    var re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return re.test(email);
} 