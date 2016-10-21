var express = require('express');
var router = express.Router();
var log = require("../conf/log").logger("index");
var navigation = {};
/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var products = db.get('products')
    products.find({}).then(function(docs) {
        res.render('index', { title: 'Express' });
    })
});

/* GET home page. */
router.get('/list', function(req, res, next) {
    var db = req.db;
    var products = db.get('navigation')
    products.find({}).then(function(docs) {
        navigation = docs;
        res.render('list', { title: 'Express1', data: docs });
    })
});

router.get('/adduser', function(req, res, next) {
    var db = req.db;
    var products = db.get('products')
    products.find({}).then(function(docs) {
        res.render('addUser', { title: 'Express1', data: docs });
    })
});

router.get('/home', function(req, res, next) {
    res.render('home', { data: navigation });
});

router.get('/aboutUs', function(req, res, next) {
    res.render('aboutUs', { data: navigation });
});

/**
 * 登录功能实现
 */
router.get('/login', function(req, res, next) {
    res.render('login', { title: '登录' });
    // var db = req.db;
    // var products = db.get('products');
    // products.find({}).then(function(docs) {
    //     res.render('addUser', { title: 'Express1', data: docs });
    // });
});

/**
 * 注册功能实现
 */
router.get('/registe', function(req, res, next) {
    res.render('registe', { title: '注册' });
    // var db = req.db;
    // var products = db.get('products');
    // products.find({}).then(function(docs) {
    //     res.render('addUser', { title: 'Express1', data: docs });
    // });
});

router.post('/postLogin', function(req, res) {
    console.log(req);
    console.log(res);
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('products');

    // Submit to the DB
    collection.insert({
        "username": userName,
        "email": userEmail
    }, function(err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {

            // And forward to success page
            res.redirect("list");
        }
    });
});

module.exports = router;