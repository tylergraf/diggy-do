var k = require('../../lib/kids.js'),
    u = require('../../lib/users.js'),
    debug = require('debug')('api:kids');

module.exports = function(app) {
  
  app.post("/api/kid", k.newKid, function(req, res, next) {
    var currentUserId = req.user.id,
        newKid = req.newKid;
        console.log(newKid);
        res.json(newKid)
    // u.saveKid(currentUserId, newKid);
    
  });
  app.get("/api/kids", k.list, function(req, res, next) {

     res.json(req.kids); 
  });

}