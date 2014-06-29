var m = require('../../lib/middleware.js'),
    r = require('../../lib/rewards.js');

module.exports = function(app) {

  // REWARDS
  app.get('/api/rewards', r.listAll, function(req, res, next){
    res.json(req.rewards);
  });
  app.get('/api/reward/:id', r.get, function(req, res, next){
    res.json(req.reward);
  });
  // app.get('/api/rewards/:id/:date', r.listByDate, function(req, res, next){
  //   res.json(req.rewards);
  // });

  app.post('/api/reward', r.newReward, function(req, res, next){
    res.json({'stuff':'thingd'});
  });

  app.put('/api/reward/:id', r.updateReward, function(req, res, next){
    res.json(req.reward);
  });
  // app.get('/api/reward/:id', r.getReward, function(req, res, next){
  //   res.json(req.reward);
  // });
  app.del('/api/reward/:id', r.deleteReward, function(req, res, next){
    res.json({message: "Successfully deleted reward."});
  });
}
