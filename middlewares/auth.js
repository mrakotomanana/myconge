function isAuthorized(roles){
    return function(req, res, next){
        if(req.session && req.session.user && roles.includes(req.session.user.role)){
            return next();
        }
        req.flash("error_msg", "Accès non autorisé !");
        return res.redirect('/');
    }
}

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.flash("error_msg", "Veuillez vous connecter !");
        return res.redirect('/login');
    }
}