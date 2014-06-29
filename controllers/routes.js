/*
** deps
*/
var m = require('../lib/middleware.js');

var angularRoutes = [
  '/',
  '/homescreen',
  '/kids',
  '/chores',
  '/chores/:id',
  '/coins',
  '/coins/:id',
  '/rewards',
  '/reward/:id',
  '/profile',
  '/passcode',
  '/choose-avatar',

  // ADMIN ROUTES
  '/admin',
  '/admin-chores',
  '/admin-kids',
  '/admin-rewards',
  '/admin-add-chore',
  '/admin-add-kid',
  '/admin-add-reward',
  '/admin-edit-chore/:id',
  '/admin-edit-kid/:id',
  '/admin-edit-reward/:id',
  '/admin-edit-reward',
  '/admin-chore-feed',
  '/admin-kid-feed'
];
module.exports = function(app) {
  angularRoutes.forEach(function(r) {
    app.get(r, m.auth, function(req, res, next) {
      res.render('angular', {user: req.user});
    });
  });
  app.get('/login', function(req, res, next) {
    res.render('angular');
  });
  app.get('/create-account', function(req, res, next) {
    res.render('angular');
  });

}
