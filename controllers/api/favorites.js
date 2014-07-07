var k = require('../../lib/kids.js'),
    u = require('../../lib/users.js'),
    f = require('../../lib/favorites.js'),
    debug = require('debug')('api:favorites');

module.exports = function(app) {

  // Favorite rewards
  app.get("/api/favorite/:rewardId", f.getFavorite, function(req, res, next) {
    res.json(req.kid);
  });
  app.post("/api/favorite/:rewardId", f.addFavorite, function(req, res, next) {
    res.json({message: 'succesfully added favorite.'});
  });
  app.del("/api/favorite/:rewardId", f.deleteFavorite, function(req, res, next) {
    res.json({message: 'succesfully deleted favorite.'});
  });

}
