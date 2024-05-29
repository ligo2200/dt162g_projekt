// pulling in mongoose
const mongoose = require('mongoose');

// schema for users
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
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