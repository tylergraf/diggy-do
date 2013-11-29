module.exports = function(app){
  // app.get('/homescreen', function(req, res, next) {
  //   res.render('homescreen');
  // });
}
// module.exports = {
//   api: require('../models/api.js'),
//   index: function(req, res, callback) {
//     var data = {title:'things'};
//     callback(null, 'index', data);
//   },

//   tasks: function(req, res, callback){

//     module.exports.api.getTasks(req.user.id,function(err, tasks){

//       callback(null, 'tasks', { title: 'Express', tasks: tasks});

//     });
//   },
//   newTask: function(req, res, callback){
//     callback(null, 'newTask', {title: 'Express'})
//   },
//   postNewTask: function(req, res, callback){
//     module.exports.api.newTask(req.user.id, req.body, function(err, task){
//       res.redirect('/task/new');
//     });
//   },
//   newUser: function(req, res, callback){
//     callback(null, 'newUser', {title: 'Express'});
//     // module.exports.api.newUser(req)
//   },
//   createNewUser: function(req, res, callback){
//     module.exports.api.newUser(req.body, function(err, user){
//       if(err){

//       } else {
//         if(req.is('application/json')){
//           res.json({
//             id: user._id,
//             username: user.username,
//             email: user.email,
//           });
//         } else {
//           callback(null, 'newUser', {title: 'Express'});  
//         }
//       }
//     });
//   }

// }