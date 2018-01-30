var mongoose = require('mongoose');

// SHEMA SETUP
var citySchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

// Export the model
module.exports = mongoose.model("City", citySchema); 

