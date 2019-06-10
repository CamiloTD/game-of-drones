const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.DBSTR, { useNewUrlParser: true });

console.log('Connected to database!'.yellow.bold);

exports.Game = mongoose.model('game', new Schema({
    player_1: { type: String, required: true },
    player_2: { type: String },
    winner : String,
    wins : { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
    ties : { type: Number, default: 0 }
}));