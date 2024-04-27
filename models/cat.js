// pulling in mongoose
const mongoose = require('mongoose');

// schema for cats
const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String
    },
    birth: {
        type: Number,
    },
    color: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } //reference to user
});

// export schema
module.exports = mongoose.model('Cat', catSchema);