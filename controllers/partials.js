/**
 * Module dependencies
 */
// var m = require("../lib/middleware");

/**
 * Expose the api routes
 */
module.exports = function(app) {

  app.get('/partials/:name', function(req, res, next) {
    var name = req.params.name;
    // res.etagify();
    res.render('partials/' + name,{layout:false});
  });

  // app.get('/api/posts', api.posts);

  // app.get('/api/post/:id', api.post);
  // app.post('/api/post', api.addPost);
  // app.put('/api/post/:id', api.editPost);
  // app.delete('/api/post/:id', api.deletePost);

  // redirect all others to the index (HTML5 history)
  // app.get('*', routes.index);
};

