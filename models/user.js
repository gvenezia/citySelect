var mongoose                = require("mongoose"),
    passportLocalMongoose   = require('passport-local-mongoose');
    
// Setup userSchema
var userSchema = new mongoose.Schema({
   username: String,
   password: String
});

// Give the userSchema passport methods
userSchema.plugin(passportLocalMongoose);

// Export the Schema 
module.exports = mongoose.model("User", userSchema);