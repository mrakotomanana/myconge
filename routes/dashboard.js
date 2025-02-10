const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const isAuthorized = require('../middlewares/auth')

router.get('/', isAuthorized, (req, res) => {
    res.render('pages/dashboard', {});
});

module.exports = router;
