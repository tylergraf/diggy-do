#!/usr/bin/env node

var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , path = require('path')
  , expressLayouts = require('express-ejs-layouts')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(express);


// DB CONNECTION
if(process.env.NODE_ENV === 'production'){
  mongoose.connect(process.env.MONGOHQ_URL);
} else {
  mongoose.connect('mongodb://localhost/diggydo');
}




var app = module.exports = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options',{layout: 'layout'});
  app.use(express.favicon());
  app.use(expressLayouts);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

   // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(express.cookieParser());
  app.use(express.session(
    {
      secret: process.env.SESSION_SECRET,
      store: new MongoStore({
        mongoose_connection: mongoose.connections[0]
      }),
      cookie: {httpOnly: false}
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'assets')));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


function loadControllers(folder) {
  folder.forEach(function (file) {
    if (fs.lstatSync(__dirname + '/controllers/' + file).isDirectory()) {
      var insideFiles = fs.readdirSync(__dirname + '/controllers/' + file);
      insideFiles.forEach(function(insideFile) {
        require(__dirname + '/controllers/' + file + '/' + insideFile)(app);
      });
    } else {
      require(controllers_path+'/'+file)(app)
    }
  });
}

// LOAD ROUTES AND CONTROLLERS
var controllers_path = __dirname + '/controllers',
    controller_files = fs.readdirSync(controllers_path);
    loadControllers(controller_files);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});

