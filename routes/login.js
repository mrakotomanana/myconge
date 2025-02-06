const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Page de connexion
router.get('/login', (req, res) => {
    res.render('login');
});

// Connexion
router.post('/login', async (req, res) => {
    const { email, motDePasse } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(motDePasse, user.motDePasse))) {
        return res.redirect('/login');
    }

    req.session.user = user;
    res.redirect('/dashboard');
});

// Déconnexion
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
