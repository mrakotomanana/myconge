const mongoose = require('mongoose');
const db = require('../database/db');

const historiqueConge = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    statutFinal: { type: String, enum: ['approuvé', 'rejeté'], required: true },
}, { timestamps: true });

const HistoriqueConge = db.model('HistoriqueConge', historiqueConge);
module.exports = HistoriqueConge;
