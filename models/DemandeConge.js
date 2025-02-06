const mongoose = require('mongoose');
const db = require('../database/db');

const demandeCongeSchema = new mongoose.Schema({
    utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    type: { type: String, enum: ['congé payé', 'maladie', 'sans solde'], required: true },
    statut: { type: String, enum: ['en attente', 'approuvé', 'rejeté'], default: 'en attente' },
    motif: { type: String },
}, { timestamps: true });

const DemandeConge = db.model('DemandeConge', demandeCongeSchema);
module.exports = DemandeConge;