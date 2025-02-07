const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/login');
});

router.post('/', async (req, res) => {
    const { email, motDePasse } = req.body;
    // const user = await User.findOne({ email });

    // if (!user || !(await bcrypt.compare(motDePasse, user.motDePasse))) {
    //     req.flash("error_msg", "Identifiants incorrects");
    //     return res.redirect('/login');
    // }
    if (email === "admin@example.com" && motDePasse === "password") {
        req.session.user = { email };
        req.flash("success_msg", "Connexion réussie !");
        return res.redirect('/'); 
    }else {
        // req.flash("success_msg", "Connexion réussie !");
        // req.session.user = user;
        // res.redirect('/dashboard');
        req.flash("error_msg", "Identifiants incorrects");
        res.redirect('/login');
    }
});

module.exports = router;
