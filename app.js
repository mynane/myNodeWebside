var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('./conf/log');

var monk = require('monk');
var db = monk('localhost:27017/jingola');

var redis = require('redis'),
    RDS_PORT = 6379, //端口号
    RDS_HOST = '127.0.1.1', //服务器IP
    RDS_PWD = 'porschev',
    RDS_OPTS = { auth_pass: RDS_PWD }, //设置项
    client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

/**
 * //另一种通过认证的方式
 * client.auth(RDS_PWD, function () {
 *  console.log('通过认证');
 * })
 */

// client.on('connect', function() {
//     var key = 'skills';
//     client.sadd(key, 'C#', 'java', redis.print);
//     client.sadd(key, 'nodejs');
//     client.sadd(key, "MySQL");

//     client.multi()
//         .sismember(key, 'C#')
//         .smembers(key)
//         .exec(function(err, replies) {
//             console.log("MULTI got " + replies.length + " replies");
//             replies.forEach(function(reply, index) {
//                 console.log("Reply " + index + ": " + reply.toString());
//             });
//             client.quit();
//         });
// })

// client.on('ready', function(err) {
//     console.log('ready');
// })

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//配置日志
log4js.configure();

app.use(function(req, res, next) {
    req.db = db;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(log4js.useLog());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//express.static 设置静态文件路径
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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