var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: String,
    author: String
});


// Export the model
module.exports = mongoose.model("Comment", commentSchema); 