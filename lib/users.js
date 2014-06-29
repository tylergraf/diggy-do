var User = require('../models/Users.js'),
    Kid = require('../models/Kids.js'),
    bcrypt = require('bcrypt'),
    debug = require('debug')('middleware:user');


exports.findByEmail = function(email, done){

  User.findOne({email: email},function(err, user){
    if(err){ done(err); return;} 
    if(!user){ done(null, null); return;} 
    debug('user',user);
        
    user.id = user._id;
    // done(null, {email: user.email, password: user.password, id: user._id});
    done(null, user);
  });
}

exports.findById = function(id, done){
  User.findOne({_id: id},function(err, user){
    if(err){ done(err); return;} 
    
    user.id = user._id;
    // done(null, {email: user.email, password: user.password, id: user._id});
    done(null, user);
  });
}

exports.newUser = function(user, done){
  User.findOne({email: user.email},function(err, existingUser){
    debug('existingUser',existingUser);
    if(existingUser === null){
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, cryptedPassword) {
          new User({email: user.email, name: user.name, avatar: user.avatar, password:cryptedPassword}).save(function(err, newUser){
            if(err){return done({status: 500, message: 'Error creating account.'})}
            
            done(null, newUser);

            // passport.authenticate('local',function(){
            //   done(null, user);
            // });
          });
        });
      });
    } else {
      done({status: 409, message:'User already exists.'});
    }
  });
}


exports.save = function(userId, update, done){

    User.update({ _id: userId }, { $set: update}, function(err){

    });
}
exports.saveUsername = function(req, res, next){
  var userId = req.user.id,
      username = req.body.username,
      update = {name: username};

  if(!username){
    return next({code:400, message: 'no username'})
  }
 
  User.update({ _id: userId }, { $set: update}, function(err){
    if(err){
      return next(err);
    }
    req.username = username;
    next();
  });
}
exports.savePassword = function(req, res, next){
  var userId = req.user.id,
      password = req.body.password,
      update;


  if(!password){
    return next({code:400, message: 'no password sent.'})
  }

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, cryptedPassword) {
      update = {password: cryptedPassword};
      User.update({ _id: userId }, { $set: update}, function(err){
        if(err){
          return next(err);
        }
        next();
      });
    });
  });
 
  
}
exports.saveKid = function(userId, kid){

  User.findOne({_id: userId},function(err, user){
    if(err){ done(err); return;} 
    console.log(user);
    // var myId = user.kids[0]._id;
    // console.log('myId',myId);

    // var stuff = user.kids.id(myId);
    // console.log('stuff',stuff);
    user.kids.push(kid);
    // console.log(kid);
    // console.log(user);
    user.save();

    // console.log(user.kids.id(5276a10481f1cd9681000001));
    // done(null, {email: user.email, password: user.password, id: user._id});
  });
    // var user = this.find
    // var kids = User.kids.find();
    // console.log('kids', kids);
    // update({ _id: userId }, { $set: update}, function(err){

    // });
}

