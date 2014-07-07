var k = require('../../lib/kids.js'),
    u = require('../../lib/users.js'),
    f = require('../../lib/favorites.js'),
    debug = require('debug')('api:kids');

module.exports = function(app) {

  app.post("/api/kid", k.newKid, function(req, res, next) {
    var currentUserId = req.user.id,
        newKid = req.newKid;
        res.json(newKid)
  });
  app.get("/api/kids", k.list, function(req, res, next) {
     res.json(req.kids);
  });
  app.get("/api/kid/:id", k.getKid, function(req, res, next) {
     res.json(req.kid);
  });
  app.put("/api/kid/:id", k.updateKid, function(req, res, next) {
     res.json(req.kid);
  });
  app.del("/api/kid/:id", k.deleteKid, function(req, res, next) {
     res.json({message: 'succesfully deleted kid.'});
  });
}
