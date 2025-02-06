const mongosse = require('mongoose');

const db = mongosse.createConnection('mongodb://127.0.0.1:27017/myconge');

db.on('error', (error)=> { console.log('Erreur connection :: ' + error)});
db.on('open', ()=> { console.log('Connected to MongoDB.')})
db.on('disconnected', ()=> { console.log('Disconnected to MongoDB.')})

module.exports = db;