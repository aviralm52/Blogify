const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    coverImageURL:{
        type: String,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
}, {timestamps: true})


const BLOG = mongoose.model('blog', blogSchema);

module.exports = BLOG;