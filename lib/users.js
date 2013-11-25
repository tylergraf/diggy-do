var User = require('../models/Users.js'),
    Kid = require('../models/Kids.js'),
    bcrypt = require('bcrypt'),
    debug = require('debug')('middleware:user');


exports.findByEmail = function(email, done){

  User.findOne({email: email},function(err, user){
    if(err){ done(err); return;} 
    if(!user){ done(null, null); return;} 
    debug('user',user);
        
    done(null, {email: user.email, password: user.password, id: user._id});
  });
}

exports.findById = function(id, done){
  User.findOne({_id: id},function(err, user){
    if(err){ done(err); return;} 
    done(null, {email: user.email, password: user.password, id: user._id});
  });
}

exports.newUser = function(email, password, done){
  User.findOne({email: email},function(err, existingUser){
    debug('existingUser',existingUser);
    if(existingUser === null){
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, cryptedPassword) {
          new User({email: email ,password:cryptedPassword}).save(function(err, user){
            
            done(null, user);

            // passport.authenticate('local',function(){
            //   done(null, user);
            // });
          });
        });
      });
    } else {
      done('User already exists.');
    }
  });
}


exports.save = function(userId, update){

    User.update({ _id: userId }, { $set: update}, function(err){

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

