// pulling in mongoose
const mongoose = require('mongoose');

// schema for cats
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    }
});

// export schema
module.exports = mongoose.model('User', userSchema)