/*
* deps
*/

var Favorite = require('../models/Favorites.js'),
    _ = require('underscore'),
    debug = require('debug')('lib:favorites');

exports.addFavorite = function(req, res, next) {
  var rewardId = req.params.rewardId,
      kidId = req.headers['dd-kid-id'];

  if(typeof rewardId === 'undefined'){
    return next({code: 400, message: 'no reward id defined.'})
  }
  if(typeof kidId === 'undefined'){
    return next({code: 400, message: 'no kid id sent.'})
  }

  var newFavorite = new Favorite({_kid: kidId, _reward: rewardId});

  newFavorite.save(function(err, newFavorite) {
    if(err){return next({code: 500, message: err})}

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

exports.getFavorite = function(req, res, next) {
  var id = req.params.id;
  Kid.findOne({_id: id}, function(err, kid) {
    if(err){return next({code: 500, message: err})}
    req.kid = kid;
    next();
  })
}
exports.deleteFavorite = function(req, res, next) {
  var rewardId = req.params.rewardId,
      kidId = req.headers['dd-kid-id'];

  Favorite.findOneAndRemove({_kid: kidId, _reward: rewardId}, function(err, favorite) {
    if(err){return next({code: 500, message: err})}

    next();
  })
}
