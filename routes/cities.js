// Express
var express = require('express'),
    mongoose= require('mongoose'),
    router  = express.Router();
    
// Models
var City    = require("../models/city"),
    Comment = require("../models/comment"),
    User    = require("../models/user");

// INDEX Route - Show all cities
router.get("/", (req, res) => {
    // Get the cities from the DB
    City.find({}, function(err, DBcities) {
        if(err){
            console.log("Error while retrieving the cities");
            console.log(err);
        } else {
            res.render("cities/index", {cities:DBcities});
        }
    });
});

// NEW - Shows the form to add a new city
router.get("/new", isLoggedIn, (req, res) => {
    res.render("cities/new");
});

// CREATE Route - Allow users to create a new city
router.post("/", isLoggedIn, (req, res) => {
   var  name        = req.body.name,
        image       = req.body.image,
        description = req.body.description,
        author      =   {
                            id: req.user._id,
                            username: req.user.username
                        },
        // Pass all the new variables into the newCity
        newCity     = {name:name, image:image, description:description, author:author};
   
   City.create(newCity, function(err, createdCity) {
      if(err){
            console.log("Error while adding a city");
            console.log(err);
        } else {
           // Redirect   
           res.redirect("/cities");
        }
   });
});

// SHOW - Display a page for a specific city
router.get("/:id", (req, res) => {
    City.
        findById(req.params.id).
        populate('comments').
        exec( function(err, foundCity) {
            if (err){
                console.log(err);
            } else {
                res.render("cities/show", {city:foundCity});
            }
        });
});

// EDIT Route
router.get("/:id/edit", isAuthorizedUser, (req, res) => {
    City.findById(req.params.id, function(err, foundCity){
        if(err){
            console.log("Error ====\n" + err);
        }
        res.render("cities/edit", {city: foundCity});    
    }); 
});

// UPDATE Route
router.put("/:id", isAuthorizedUser, (req, res) => {
    City.findByIdAndUpdate(req.params.id, req.body.city, function(err, updatedCity) {
       if (err){
           console.log(err);
           res.redirect("/");
       } else {
           res.redirect("/cities/" + req.params.id);
       }
    });
});

// DESTROY Route
router.delete("/:id", isAuthorizedUser, (req, res) => {
  City.findByIdAndRemove(req.params.id, function(err) {
      if (err){
          console.log(err);
          res.redirect('back');
      } else {
          res.redirect("/cities");
      }
  });
});

// =========== Functions ==============
// Check for login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // if the user isn't logged in, redirect request to the referer
    res.redirect('back');
};

// Check for authorization to access content
function isAuthorizedUser(req, res, next){
    if (req.isAuthenticated()){
        City.findById(req.params.id, function(err, foundCity){
            if (err) {
                res.redirect("back");
                
            // Is the user the creator of the city's page?
            } else if (foundCity.author.id.equals(req.user._id)){ 
                next(); // DON'T RETURN THIS. Caused a CastError problem further down the line
                
            } else {
                res.redirect("back");
                
            }
        }); // End City.find for logged in user
    } else {
        res.redirect("back");
    }
}; // End checkForAuthorizedUser


// ======= Export to app.js =============
module.exports = router;