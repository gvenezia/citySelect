// Express
var express = require('express'),
    router  = express.Router({mergeParams: true});
    
// Models
var City    = require("../models/city"),
    Comment = require("../models/comment"),
    User    = require("../models/user");
    
// NEW comment
router.get("/new", isLoggedIn, function(req, res){
   City.findById(req.params.id, function(err, foundCity){
       if (err){
           console.log(err);
       } else {
           res.render("comments/new", {city:foundCity});
       }
   });
});

// CREATE comment
router.post("/", isLoggedIn, function(req, res){
    City.findById(req.params.id, function(err, foundCity){
        if (err) {
            console.log(err);
            res.redirect("/cities");
        } else {
            // Create the new comment with the submitted info in req.body.comment
            Comment.create(req.body.comment, function(err, newComment){
                if (err){
                    console.log(err)
                } else {
                    // Assign the username and id to the Comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    
                    // Save the new information in the comment
                    newComment.save();
                    
                    // push the newComment and save it
                    foundCity.comments.push(newComment);
                    foundCity.save();
                    
                    // Redirect to the appropriate city's show page
                    res.redirect("/cities/" + foundCity._id);   
                }
            }); // End Comment.create()
        } // End if-else
    }); // End City.find
}); // End create comment route

// =========== Functions ==============
// Check for login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // if the user isn't logged in, redirect request to the referer
    res.redirect('back');
};

module.exports = router;