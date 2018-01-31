var mongoose = require('mongoose');

// SHEMA SETUP
var citySchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }]
});

// Export the model
module.exports = mongoose.model("City", citySchema); 

