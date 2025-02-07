var express = require('express');
var router = express.Router();

function isAuthentificated(req, res, next){
  if(req.session && req.session.user){
    next();
  }else{
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', isAuthentificated, function(req, res, next) { 
  console.log("eto zao 4");

  res.render('pages/index', { title: 'Express' });
});

module.exports = router;
