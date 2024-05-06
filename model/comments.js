const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
})


const COMMENT = mongoose.model('comment', commentSchema);


module.exports = COMMENT;