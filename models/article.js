// pulling in mongoose
const mongoose = require('mongoose');

// schema for cats
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

// export schema
module.exports = mongoose.model('Article', articleSchema)