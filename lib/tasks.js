/*
* deps
*/

var Task = require('../models/Tasks.js'),
    Transaction = require('../models/Transactions.js'),
    moment = require('moment'),
    _ = require('underscore'),
    debug = require('debug')('lib:tasks');

exports.newTask = function(req, res, next) {
  var task = req.body;
  task._user = req.user.id;
  if(typeof task === 'undefined'){
    return res.json(400,{message: 'no task sent.'});
  }

  var newTask = new Task(task);
  
  newTask.save(function(err, task) {
    if(err){return next({code: 500, message: err})}
    req.task = task;
  });
  
  
  next();

}

exports.getTask = function(req, res, next) {
  var id = req.params.id;
  Task.findOne({_id: id}, function(err, task) {
    if(err){return next({code: 500, message: err})}
    req.task = task;
    next();
  })
}
exports.updateTask = function(req, res, next) {
  var id = req.params.id,
      task = req.body.task;
      delete task._id;
  if(typeof task === 'undefined'){
    return next({code: 400, message: 'no task sent.'})
  }

  Task.findByIdAndUpdate(id, { $set: task}, function (err, task) {
    if(err){return next({code: 500, message: err})}
    req.task = task;
    next();
  });
}
exports.deleteTask = function(req, res, next) {
  var id = req.params.id;
  Task.remove({_id: id}, function(err) {
    if(err){return next({code: 500, message: err})}
    next();
  });
}
exports.list = function(req, res, next) {
  var id = req.params.id;
  Task.find({kidId: id}, function(err, tasks) {
    if(err){return next({code: 500, message: err})}
    req.tasks = tasks;
    next();
  });
}

exports.listAll = function(req, res, next) {
  var id = req.user.id;
  Task.find({_user: id}).populate('_kid').exec(function(err, tasks) {
    if(err){return next({status: 500, message: err});}
      
    req.tasks = tasks;
    next();
  })
}

exports.listByDate = function(req, res, next) {
  var id = req.params.id, 
      unixDate = moment.unix(req.params.date),
      date = unixDate.format('YYYYMMDD'),
      day = unixDate.format('dddd').toLowerCase(),
      filteredTasks = [],
      query = (id === 'all') ? {_user: req.user.id} : {_kid: id};

  Task.find(query).populate('_kid').exec(function(err, tasks) {
    console.log('tasks', tasks);
    req.tasks = tasks;
    tasks.forEach(function(t, i) {
      t.done = false;
      t.approved = false;
      if(t.repeated[day]){
        filteredTasks.push(t);
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