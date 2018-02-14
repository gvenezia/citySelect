// Models
var City    = require('../models/city'),
    Comment = require('../models/comment'),
    User    = require('../models/user');

// Middleware object stores middleware functions/methods
var middlewareObj = {

    // Check for login
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            next();
        } else { // make sure the else is here, otherwise you'll get a "Can't set headers error" https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client 
        // if the user isn't logged in, flash message and redirect request to the referer
        req.flash("error", "Please login first...");
        res.redirect('back');
        }
    },
    
    // Check for authorization to edit comments
    isAuthorizedCommenter: function(req, res, next){
        if (req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if (err) {
                    res.redirect("back");
                    
                // Is the user the creator of the comment?
                } else if (foundComment.author.id.equals(req.user._id)){ 
                    next(); // DON'T RETURN THIS. Caused a CastError problem further down the line
                    
                } else {
                    req.flash("error", "Only the creators of a comment can edit it. Please log in as the user who created this comment");
                    res.redirect("back");
                    
                }
            }); // End Comment.find for logged in user
        } else {
            req.flash("error", "Only the creator of a comments can edit it. Please log in as the user who created this comment");
            res.redirect("back");
        }
    }, // End checkForAuthorizedUser
    
    // Check for authorization to access content
    isAuthorizedUser: function(req, res, next){
        if (req.isAuthenticated()){
            City.findById(req.params.id, function(err, foundCity){
                if (err) {
                    res.redirect("back");
                    
                // Is the user the creator of the city's page?
                } else if (foundCity.author.id.equals(req.user._id)){ 
                    next(); // DON'T RETURN THIS. Caused a CastError problem further down the line
                    
                } else {
                    req.flash("error", "Only the creator of a city page can edit it. Please log in as the user who created this city page");
                    res.redirect("back");
                    
                }
            }); // End City.find for logged in user
        } else {
            req.flash("error", "Only the creator of a city page can edit it. Please log in as the user who created this city page");
            res.redirect("back");
        }
    }, // End checkForAuthorizedUser

}; // End middleware object

// export middleware object
module.exports = middlewareObj;