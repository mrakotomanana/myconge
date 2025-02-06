var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const users = await User.find({});
    console.log(users);
    res.json(users);    
  } catch (error) {
    res.status(500).json({message : 'Erreur interne.'});
  }
});

router.post('/', async function(req, res, next) {
  const { username, email, password } = req.body;
  try {
    const user = new User({username, email, password});
    const id = await user.save();
    console.log(id);
    res.json({message : 'Création user success.'});
  } catch (error) {
    res.status(500).json({message : 'Erreur interne.'});
  }
});

module.exports = router;
