var mongoose = require('mongoose');

// SHEMA SETUP
var citySchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author: {
        id: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User"
        },
        username: String
       },
   comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      },]
});

// Export the model
module.exports = mongoose.model("City", citySchema); 

