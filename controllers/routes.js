/*
** deps
*/
var m = require('../lib/middleware.js');

var angularRoutes = [
  '/',
  '/kids',
  '/chores',
  '/chores/:id',
  '/coins',
  '/coins/:id',
  '/rewards',
  '/profile',
  '/passcode',

  // ADMIN ROUTES
  '/admin',
  '/admin-chores',
  '/admin-add-chore',
  '/admin-chore-feed'
];
module.exports = function(app) {
  angularRoutes.forEach(function(r) {
    app.get(r, m.auth, function(req, res, next) {
      res.render('angular', {user: req.user});
    });
  });
  app.get('/create-account', function(req, res, next) {
    res.render('angular', {user: req.user});
  });
  
}