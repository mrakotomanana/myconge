const mongoose = require('mongoose');
const db = require('../database/db');

const notificationSchema = new mongoose.Schema({
    destinataireId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    offRead: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = db.model('Notification', notificationSchema);
module.exports = Notification;
