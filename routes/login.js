const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const isAuthorized = require('../middlewares/auth')

router.get('/', (req, res) => {
    res.render('pages/login');
});

router.post('/', async (req, res) => {
    const { email, motDePasse, idRole } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(user.email === email)) {
        console.log('eto zao');
        const hashedPassword = await bcrypt.hash(motDePasse, 10);
        if(!(await bcrypt.compare(hashedPassword, user.password)) || !(idRole === user.role)){
            req.flash("error_msg", "Identifiants incorrects");
            return res.redirect('/login');
        }
    }
    req.session.user = user;
    req.flash("success_msg", "Connexion réussie !");
    return res.render('/dashboard');
});

module.exports = router;
