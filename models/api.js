var User = require('./Users.js')
    ,Tasks = require('./Tasks.js')
    // ,Checkins = require('./Checkins.js')
    ,passport = require('passport')
    ,bcrypt = require('bcrypt');
module.exports = {
  mongoose: require('mongoose'),


// USERS
  findByUsername: function(username, callback){
    User.findOne({username: username},function(err, user){
      if(err){
        console.log(err);
      } else {
        callback(null, {username: user.username, password: user.password, id: user._id});
      }
    });
  },
  findById: function(id, callback){
    User.findOne({_id: id},function(err, user){
      if(err){
        console.log(err);
      } else {
        callback(null, {username: user.username, password: user.password, id: user._id});
      }
    });
  },
  newUser: function(user, callback){
    User.findOne({username: user.username},function(err, existingUser){
      if(existingUser === null){
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(user.password, salt, function(err, cryptedPassword) {
            new User({username: user.username ,email: user.email ,password:cryptedPassword}).save(function(err, user){
              
              callback(null, user);

              // passport.authenticate('local',function(){
              //   callback(null, user);
              // });
            });
          });
        });
      } else {
        callback('User already exists.');
      }
    });
  },
  updateUser: function(userId, update){

      User.update({ _id: userId }, { $set: update}, function(err){

      });
  },


  // HABITS
  getTasks: function(userId, callback){

    User.findOne({_id: userId},function(err, user){
      if(err){

      } else{

        var tasks = user.tasks;

        callback(null, tasks)
      }
    });
  },

  newTask: function(userId, taskObj, callback){
    User.findOne({_id: userId},function(err, user){
      if(err){
        console.log(err);
      } else{
        // if(taskName === ''){
        //   callback('Please submit task name.');
        // } else {
          var newTask = new Tasks(taskObj);
          user.tasks.push(newTask);
          user.save(function(err,task){
            callback(null, task);
          }); 
        // }
      }
    });
  }
}