// Express
var express     = require('express'),
    middleware  = require('../middleware'),
    router      = express.Router({mergeParams: true});
    
    
// Models
var City    = require('../models/city'),
    Comment = require('../models/comment'),
    User    = require('../models/user');
    
// ================= Routes =====================
// NEW comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
   City.findById(req.params.id, (err, foundCity) => {
       if (err){
           console.log(err);
       } else {
           res.render("comments/new", {city:foundCity});
       }
   });
});

// CREATE comment
router.post("/", middleware.isLoggedIn, (req, res) => {
    City.findById(req.params.id, (err, foundCity) => {
        if (err) {
            console.log(err);
            res.redirect("/cities");
        } else {
            // Create the new comment with the submitted info in req.body.comment
            Comment.create(req.body.comment, (err, newComment) => {
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
router.get("/:comment_id/edit", middleware.isAuthorizedCommenter, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            console.log("Error ====\n" + err);
        } else {
            res.render("comments/edit", {city_id: req.params.id, comment: foundComment});          
        }
        
    }); 
});

// // UPDATE Route 
router.put("/:comment_id", middleware.isAuthorizedCommenter, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
       if (err){
           console.log(err);
           res.redirect("/");
       } else {
           res.redirect("/cities/" + req.params.id );
       }
    });
}); 

// DESTROY Route
router.delete("/:comment_id", middleware.isAuthorizedCommenter, (req, res) => {
   Comment.findByIdAndRemove(req.params.comment_id, (err) => {
      if (err){
          console.log(err);
          res.redirect('back');
      } else {
          res.redirect("/cities/" + req.params.id);
      }
  });
});

// ======== Handle Promise rejections ======
process.on('unhandledRejection', err => console.log(err.stack));

// ======= Export to app.js =============
module.exports = router;