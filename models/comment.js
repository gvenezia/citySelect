var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: String,
    // created: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});


// Export the model
module.exports = mongoose.model("Comment", commentSchema); 