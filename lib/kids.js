/*
* deps
*/

var Kid = require('../models/Kids.js'),
    debug = require('debug')('lib:kids');

exports.newKid = function(req, res, next) {
  var kid = req.body;

  if(typeof kid === 'undefined'){
    return res.json(400,{message: 'no kid sent.'});
  }

  var newKid = new Kid({name: kid.name, _user: req.user.id, points: 0});
  
  newKid.save(function(err, newKid) {
    req.newKid = newKid;
    next();
  });
  
  

}

exports.list = function(req, res, next) {
  var id = req.user.id;
  Kid.find({_user: id}, function(err, kids) {
    req.kids = kids;
    next();
  })
}
exports.updatePoints = function(req, res, next) {
  var kid = req.kid,
      amount = req.amount,
      addPoints = req.addPoints;


  Kid.findOne({_id: kid._id}, function(err, kid) {
    var currentPoints = kid.points;
    if(addPoints){
      kid.points += amount;
    } else {
      kid.points -= amount;
    }

    kid.save();
    next();
  })
}
