const express = require('express');
const DemandeConge = require('../models/DemandeConge');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Middleware d'authentification
function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Tableau de bord
router.get('/dashboard', isAuthenticated, async (req, res) => {
    const demandes = await DemandeConge.find({ utilisateurId: req.session.user._id });
    res.render('dashboard', { user: req.session.user, demandes });
});

// Formulaire de demande de congé
router.get('/demande-conge', isAuthenticated, (req, res) => {
    res.render('newDemande', { user: req.session.user });
});

// Soumettre une demande de congé
router.post('/demande-conge', isAuthenticated
    [
        body('dateDebut').isISO8601().withMessage('La date de début est invalide'),
        body('dateFin').isISO8601().withMessage('La date de fin est invalide'),
        body('dateFin').custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.dateDebut)) {
                throw new Error('La date de fin doit être après la date de début');
            }
            return true;
        }),
        body('type').notEmpty().withMessage('Le type de congé est requis'),
        body('motif').trim().isLength({ min: 5 }).withMessage('Le motif doit contenir au moins 5 caractères')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error_msg', errors.array().map(err => err.msg).join('. '));
            return res.redirect('/demande-conge');
        }
        const { dateDebut, dateFin, type, motif } = req.body;
        const user = await User.findById(req.session.user._id);

        const newDemande = new DemandeConge({
            utilisateurId: user._id,
            startDate,
            dueDate,
            type,
            motif,
            statut: 'en attente'
        });

        await newDemande.save();
        req.flash('success_msg', 'Votre demande de congé a été envoyée.');
        res.redirect('/dashboard');
});

// Liste des demandes pour l'admin
router.get('/admin/demandes', isAuthenticated, async (req, res) => {
    if (req.session.user.role !== 'admin') return res.redirect('/dashboard');

    const demandes = await DemandeConge.find().populate('utilisateurId', 'nom email');
    res.render('demandes', { demandes, user: req.session.user });
});

// Approuver ou rejeter une demande
router.post('/admin/demande/:id', isAuthenticated, async (req, res) => {
    if (req.session.user.role !== 'admin') return res.redirect('/dashboard');

    const { statut } = req.body;
    const demande = await DemandeConge.findById(req.params.id);
    demande.statut = statut;
    await demande.save();

    req.flash('success_msg', `La demande a été ${statut}.`);

    res.redirect('/admin/demandes');
});

router.get('/api/conges', async (req, res) => {
    try {
        const conges = await LeaveRequest.find({ statut: 'validé' });
        const events = conges.map(conge => ({
            title: conge.type,
            start: conge.dateDebut,
            end: conge.dateFin,
            color: 'green' // Couleur pour les congés validés
        }));
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors du chargement des congés' });
    }
});

router.post('/demande-conge/:id/valider', isAdmin, async (req, res) => {
    await LeaveRequest.findByIdAndUpdate(req.params.id, { statut: 'validé' });
    req.flash('success_msg', 'Demande de congé validée');
    res.redirect('/dashboard');
});

router.post('/demande-conge/:id/refuser', isAdmin, async (req, res) => {
    await LeaveRequest.findByIdAndUpdate(req.params.id, { statut: 'refusé' });
    req.flash('error_msg', 'Demande de congé refusée');
    res.redirect('/dashboard');
});


module.exports = router;
