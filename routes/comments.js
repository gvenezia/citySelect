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
                    console.log("cannot create comment \n");
                    console.log(err)
                } else {
                    // Assign the username and id to the Comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    
                    // Save the new information in the comment
                    newComment.save();
                    
                    // push the newComment and save it
                    foundCity.comments.push(newComment._id);
                    foundCity.save();
                    
                    // Redirect to the appropriate city's show page
                    res.redirect("/cities/" + foundCity._id);   
                }
            }); // End Comment.create()
        } // End if-else
    }); // End City.find
}); // End create comment route

// EDIT Route
router.get("/:comment_id/edit", isAuthorizedCommenter, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            console.log("Error ====\n" + err);
        } else {
            res.render("comments/edit", {city_id: req.params.id, comment: foundComment});          
        }
        
    }); 
});

// // UPDATE Route 
router.put("/:comment_id", isAuthorizedCommenter, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if (err){
           console.log(err);
           res.redirect("/");
       } else {
           res.redirect("/cities/" + req.params.id );
       }
    });
}); 

// DESTROY Route
router.delete("/:comment_id", isAuthorizedCommenter, (req, res) => {
   Comment.findByIdAndRemove(req.params.comment_id, (err) => {
      if (err){
          console.log(err);
          res.redirect('back');
      } else {
          res.redirect("/cities/" + req.params.id);
      }
  });
});



// =========== Functions ==============
// Check for login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else { // make sure the else is here, otherwise you'll get a "Can't set headers error" https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client 
    // if the user isn't logged in, redirect request to the referer
    res.redirect('back');
    }
};

// Check for authorization to access content
function isAuthorizedCommenter(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
                
            // Is the user the creator of the comment?
            } else if (foundComment.author.id.equals(req.user._id)){ 
                next(); // DON'T RETURN THIS. Caused a CastError problem further down the line
                
            } else {
                res.redirect("back");
                
            }
        }); // End Comment.find for logged in user
    } else {
        res.redirect("back");
    }
}; // End checkForAuthorizedUser


// ======== Handle Promise rejections ======
process.on('unhandledRejection', err => console.log(err.stack));

// ======= Export to app.js =============
module.exports = router;