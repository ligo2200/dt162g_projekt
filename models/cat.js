// pulling in mongoose
const mongoose = require('mongoose');

// schema for cats
const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    birth: {
        type: Number,
    },
    description: {
        type: String
    }
});

// export schema
module.exports = mongoose.model('Cat', catSchema)