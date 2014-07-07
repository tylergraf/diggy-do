/*
* deps
*/

var Kid = require('../models/Kids.js'),
    Transaction = require('../models/Transactions.js'),
    debug = require('debug')('lib:kids');

exports.newKid = function(req, res, next) {
  var kid = req.body.kid;
  console.log(kid);
  if(typeof kid === 'undefined'){
    return next({code: 400, message: 'no kid sent.'})
  }

  var newKid = new Kid({name: kid.name, _user: req.user.id, points: 0, avatar: {color: kid.avatar.color, icon: kid.avatar.icon}, passcode: kid.passcode});

  newKid.save(function(err, newKid) {
    if(err){return next({code: 500, message: err})}
    req.newKid = newKid;
    next();
  });



}

exports.list = function(req, res, next) {
  console.log(req.user);
  var id = req.user.id;
  Kid.find({_user: id}, function(err, kids) {
    if(err){return next({code: 500, message: err})}
    req.kids = kids;
    next();
  })
}

exports.getKid = function(req, res, next) {
  var id = req.params.id;
  Kid.findOne({_id: id}, function(err, kid) {
    if(err){return next({code: 500, message: err})}
    req.kid = kid;
    next();
  })
}
exports.updateKid = function(req, res, next) {
  var id = req.params.id,
      kid = req.body.kid;
      delete kid._id;
  if(typeof kid === 'undefined'){
    return next({code: 400, message: 'no kid sent.'})
  }

  Kid.findByIdAndUpdate(id, { $set: kid}, function (err, kid) {
    if(err){return next({code: 500, message: err})}
    next();
  });
}
exports.deleteKid = function(req, res, next) {
  var id = req.params.id;
  Kid.remove({_id: id}, function(err) {
    if(err){return next({code: 500, message: err})}
    next();
  })
}
exports.updatePoints = function(req, res, next) {
  var kid = req.kid,
      amount = req.amount,
      addPoints = req.addPoints;

  Transaction.find({_kid: kid._id, approved: true}).sort('+dateUpdated').exec(function(err, transactions){
    if(err){return next({code: 500, message: err})}
    var points = 0;
console.log('TRANSACTIONS');
console.log(transactions);
    transactions.forEach(function(t,i){
      points += t.value;
    });

    Kid.findOne({_id: kid._id}, function(err, kid) {
      if(err){return next({code: 500, message: err})}

      kid.points = points;

      kid.save();
      next();
    })
  });

}
