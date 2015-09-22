var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
//var zerorpc = require('zerorpc');
var PythonShell = require('python-shell');
var session = require('express-session');
 

 var app = express();

var debug = require('debug')('http');

var busboyBodyParser = require('busboy-body-parser');


var db = mongoose.connection;
mongoose.connect('mongodb://localhost/knowledgebase');

// Configuring Passport
var passport = require('passport');
//var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(session({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);


var routes = require('./routes/index');

var patients = require('./routes/patients')(passport);
//var upload = require('./routes/upload');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//to deliver all static files, like css, html etc
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboyBodyParser());
app.use(session({secret: 'smek'}));

app.use('/', routes);

app.use('/patients',patients);
//app.use('/upload',upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
