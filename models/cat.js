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
    age: {
        type: Int16Array
    },
    description: {
        type: String
    }
});

// export schema
module.exports = mongoose.model('Cat', catSchema)