const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/register');
});

router.post('/', async (req, res) => {
    const { nom, email, motDePasse, idRole } = req.body;
    console.log(nom, email, motDePasse, idRole);

    let user = await User.findOne({ username: nom, email });
    if(user){
        req.flash("error_msg", "Identifiant existant.");
        req.session.user = null;
        return res.render('pages/register');
    }
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    user = new User({ username: nom, email, password: hashedPassword, idRole });
    await user.save();
    console.log('Nouvel utilisateur enregistré :', user.username);
    req.flash('success_msg', 'Nouvel utilisateur enregistré :', user.username);
    req.session.user = user;
    return res.redirect('/');
});

module.exports = router;
