var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/proxy', function(req, res, next){
    request(req.query.url, function(err, response, body){
        res.set('Content-Type', 'application/json');
        res.send(body);
    })
});

/* GET home page. */
router.get('/r/*', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
