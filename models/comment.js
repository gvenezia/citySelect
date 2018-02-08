var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.CommentId,
            ref: 'User'
        },
        username: String
    }
});


// Export the model
module.exports = mongoose.model("Comment", commentSchema); 