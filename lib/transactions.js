/*
* deps
*/

var Transaction = require('../models/Transactions.js'),
    Kid = require('../models/Kids.js'),
    moment = require('moment'),
    _ = require('underscore'),
    debug = require('debug')('lib:tasks');

exports.newTransaction = function(req, res, next) {
  var transaction = req.body
      userId = req.user.id;

  transaction.date = moment.unix(transaction.date).format('YYYYMMDD')
  if(typeof transaction === 'undefined'){
    return res.json(400,{message: 'no transaction sent.'});
  }
  var newTransaction = new Transaction({_user: transaction._kid._user, date: transaction.date, _kid: transaction._kid._id, _task: transaction._task});
  
  newTransaction.save(function(err) {
    if(err){
      console.log(err);
      return next({status: 500, message: err});
    }
    req.transaction = transaction;
    next();
  });
  
  

}
exports.updateTransaction = function(req, res, next) {
  var transactionId = req.params.id,
      approved = req.body.transaction.approved;

  // Transaction.update({ _id: transactionId },{$set: {approved: approved}}, function(err) {
    Transaction.findOne({_id: transactionId}).populate('_task').populate('_kid').exec(function(err, transaction) {
      transaction.approved = approved;

      transaction.save();

      req.kid = transaction._kid;
      req.addPoints = approved;
      req.amount = transaction._task.value;
      
      next(); 
    // });
  });
  

}
exports.deleteTransaction = function(req, res, next) {
  Transaction.remove({ _id: req.params.id }, function(err, transaction) {
    next();
  });
  

}
exports.allTransactions = function(req, res, next) {
  Transaction.find({ _kid: req.params.id, approved: true}).populate('_task').populate('_kid').exec(function(err, transactions) {
    req.transactions = transactions;
    next();
  });
  

}

exports.allTransactionsByDate = function(req, res, next) {
  var combined = [],
      unixDate = req.params.date,
      date = moment.unix(unixDate).format('YYYYMMDD'),
      userId = req.user.id;
      console.log('date', date);
  Transaction.find({_user: userId, date: date}).populate('_kid').populate('_task').exec(function(err, transactions) {
    console.log('transactions',transactions);
    req.transactions = transactions;
    next();
  });
  // Transaction.find(function(err, transactions) {
  //   transactions.forEach(function(t,i) {
  //     Kid.find({_id: t.kidId}, function(err, kid) {
  //       // console.log(kid);
  //       var trans = t;
  //       trans.kid = kid;
  //       combined.push(trans);
  //     });
  //   });
    // req.transactions = combined;
  // });
  

}


exports.listByDate = function(req, res, next) {
  var id = req.params.id, 
      date = req.params.date,
      day = moment.unix(date).format('dddd').toLowerCase();


  Task.find({kidId: id}, function(err, tasks) {
    req.tasks = tasks;
    var filteredTasks = [];
    
    tasks.forEach(function(t, i) {
      if(t.repeated[day]){
        filteredTasks.push(t);
      }
    });
    req.tasks = filteredTasks;
    next();
  })
}