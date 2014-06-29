/*
* deps
*/

var Reward = require('../models/Rewards.js'),
    moment = require('moment'),
    _ = require('underscore'),
    debug = require('debug')('lib:rewards');

exports.newReward = function(req, res, next) {
  var reward = req.body;
  reward._user = req.user.id;

  if(!reward._user){
    return res.json(403, {message: 'no user.'});
  }
  if(_.isEmpty(reward) ){
    return res.json(400, {message: 'no reward sent.'});
  }

  var newReward = new Reward(reward);

  newReward.save(function(err, reward) {
    if(err){return next({code: 500, message: err})}
    req.reward = reward;
  });


  next();

}

exports.listAll = function(req, res, next) {
  var id = req.user.id;
  Reward.find({_user: id}, function(err, rewards) {
    if(err){return next({status: 500, message: err});}

    req.rewards = rewards;
    next();
  })
}

exports.get = function(req, res, next) {
  var id = req.params.id;
  Reward.findOne({_id: id}, function(err, reward) {
    if(err){return next({code: 500, message: err})}
    req.reward = reward;
    next();
  })
}
exports.updateReward = function(req, res, next) {
  var id = req.params.id,
      reward = req.body.reward;
      delete reward._id;
  if(typeof reward === 'undefined'){
    return next({code: 400, message: 'no reward sent.'})
  }

  Reward.findByIdAndUpdate(id, { $set: reward}, function (err, reward) {
    if(err){return next({code: 500, message: err})}
    req.reward = reward;
    next();
  });
}
exports.deleteReward = function(req, res, next) {
  var id = req.params.id;
  Reward.remove({_id: id}, function(err) {
    if(err){return next({code: 500, message: err})}
    next();
  });
}



exports.listByDate = function(req, res, next) {
  var id = req.params.id,
      unixDate = moment.unix(req.params.date),
      date = unixDate.format('YYYYMMDD'),
      day = unixDate.format('dddd').toLowerCase(),
      filteredRewards = [],
      query = (id === 'all') ? {_user: req.user.id} : {_kid: id};

  Reward.find(query).populate('_kid').exec(function(err, tasks) {
    console.log('tasks', tasks);
    req.tasks = tasks;
    tasks.forEach(function(t, i) {
      t.done = false;
      t.approved = false;
      if(t.repeated[day]){
        filteredRewards.push(t);
      }
    });

    Transaction.find({date: date}, function(err, transactions) {
      transactions.forEach(function(tr, i) {
        filteredTasks.forEach(function(ft, i) {
          if(ft._id.toString() == tr._task.toString()){
            ft.approved = tr.approved;
            ft.done = true;
            ft.transactionId = tr._id;
          }
        });
      });

      req.tasks = filteredTasks;
      // console.log(filteredTasks);
      next();
    });
  });
}
