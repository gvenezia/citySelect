// Express
var express = require('express'),
    router  = express.Router();
    
// Models
var City    = require("../models/city"),
    Comment = require("../models/comment"),
    User    = require("../models/user");

// INDEX Route - Show all cities
router.get("/", function(req, res){
    // Get the cities from the DB
    City.find({}, function(err, DBcities){
        if(err){
            console.log("Error while retrieving the cities");
            console.log(err);
        } else {
            res.render("cities/index", {cities:DBcities});
        }
    });
});

// NEW - Shows the form to add a new city
router.get("/new", function(req, res){
    res.render("cities/new");
});

// CREATE Route - Allow users to create a new city
router.post("/", function(req, res){
   var  name        = req.body.name,
        image       = req.body.image,
        description = req.body.description,
        newCity     = {name, image, description};
   
   City.create(newCity, function(err, newCity){
      if(err){
            console.log("Error while adding a city");
            console.log(err);
        } else {
           // Redirect   
           res.redirect("/");
        }
   });
});

// SHOW - Display a page for a specific city
router.get("/:id", function(req, res){
    City.
        findById(req.params.id).
        populate('comments').
        exec( function(err, foundCity){
            if (err){
                console.log(err);
            } else {
                res.render("cities/show", {city:foundCity});
            }
        });
});

// RESTFUL ROUTES NEEDED:
    // DESTROY
    // EDIT
    // UPDATE
    
module.exports = router;