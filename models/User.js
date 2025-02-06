const db = require('../database/db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employe', 'admin'], default: 'employe' },
    soldeConges: { type: Number, default: 30 },
}, { timestamps: true });

const User = db.model('User', userSchema);
module.exports = User;
