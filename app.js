var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//express for image in formidable
var formidable = require('express-formidable');
//middlewares
var session_middleware = require('./middlewares/session');
//jquery
var jquery = require('jquery');
//db - models
var mongoose = require('mongoose');
var Register = require('./models/users').Register;
//engine views
var hbs = require('express-handlebars')
//session
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var realtime = require('./realtime');
//routes
var index = require('./routes/index');
var users = require('./routes/users');
var router_app = require('./routes/router_app');
//servidor http / Socket Server comunication
var http = require('http');
var io = require('socket.io').listen(server);

var app = express();

var server = http.createServer(app);
mongoose.connect('mongodb://localhost/test');

//redis
var sessionMiddleware = session({
  store: new RedisStore({}),
  secret: "Hola ladron",
  saveUninitialized: false,
  resave: false
});
realtime(server, sessionMiddleware);
// Engine of Handlebars
app.engine('hbs', hbs({
  extname:'hbs',
  defaultLayout: 'main',
  layoutsDir:__dirname + '/views/layouts'}
));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//methodOverride middlewares
app.use(methodOverride("_method"));
//session
app.use(sessionMiddleware);
//formidable
app.use( formidable.parse({ keepExtensions: true }));
//routes
app.use('/', index);
app.use('/users', users);
app.use('/app', session_middleware);
app.use('/app', router_app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
