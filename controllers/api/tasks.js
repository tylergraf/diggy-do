var m = require('../../lib/middleware.js'),
    t = require('../../lib/tasks.js'),
    Tasks = require('../../models/Tasks.js');

module.exports = function(app) {

  // TASKS
  app.get('/api/tasks/all', t.listAll, function(req, res, next){
    res.json(req.tasks);
  });
  app.get('/api/tasks/:id', t.list, function(req, res, next){
    res.json(req.tasks);
  });
  app.get('/api/tasks/:id/:date', t.listByDate, function(req, res, next){
    res.json(req.tasks);
  });
  app.get('/task/new', m.auth, function(req, res, next){
    // controller.newTask(req, res, function(error, view, data) {
    //   res.render(view, data);
    // });
  });
  app.post('/api/task', t.newTask, function(req, res, next){
    res.json({'stuff':'thingd'});
  });
  app.put('/api/task/:id', t.updateTask, function(req, res, next){
    res.json(req.task);
  });
  app.get('/api/task/:id', t.getTask, function(req, res, next){
    res.json(req.task);
  });
  app.del('/api/task/:id', t.deleteTask, function(req, res, next){
    res.json({message: "Successfully deleted task."});
  });
}