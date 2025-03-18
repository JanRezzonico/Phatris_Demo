const mongoose = require('mongoose');

const scoreboardSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    points:{
        type: Number,
        required: true,
        default: 0
    },
    mode:{
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('Scoreboard', scoreboardSchema);