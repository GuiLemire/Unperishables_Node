const mongoose = require('mongoose')

const perishableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bestBeforeDate: {
        type: Date,
        default: Date.now
    },
    boughtDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Perishable', perishableSchema)