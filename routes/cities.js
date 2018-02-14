// Express
var express     = require('express'),
    middleware  = require('../middleware'),
    mongoose    = require('mongoose'),
    router      = express.Router();
    
// Models
var City    = require("../models/city"),
    Comment = require("../models/comment"),
    User    = require("../models/user");


// ================= Routes =====================
// INDEX Route - Show all cities
router.get("/", (req, res) => {
    // Get the cities from the DB
    City.find({}, (err, DBcities) => {
        if(err){
            console.log("Error while retrieving the cities");
            console.log(err);
        } else {
            res.render("cities/index", {cities:DBcities});
        }
    });
});

// NEW - Shows the form to add a new city
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("cities/new");
});

// CREATE Route - Allow users to create a new city
router.post("/", middleware.isLoggedIn, (req, res) => {
   var  name        = req.body.name,
        image       = req.body.image,
        description = req.body.description,
        author      =   {
                            id: req.user._id,
                            username: req.user.username
                        },
        // Pass all the new variables into the newCity
        newCity     = {name:name, image:image, description:description, author:author};
   
   City.create(newCity, (err, createdCity) => {
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
        exec( (err, foundCity) => {
            if (err){
                console.log(err);
            } else {
                res.render("cities/show", {city:foundCity});
            }
        });
});

// EDIT Route
router.get("/:id/edit", middleware.isAuthorizedUser, (req, res) => {
    City.findById(req.params.id, (err, foundCity) => {
        if(err){
            console.log("Error ====\n" + err);
        }
        res.render("cities/edit", {city: foundCity});    
    }); 
});

// UPDATE Route
router.put("/:id", middleware.isAuthorizedUser, (req, res) => {
    City.findByIdAndUpdate(req.params.id, req.body.city, (err, updatedCity) => {
       if (err){
           console.log(err);
           res.redirect("/");
       } else {
           res.redirect("/cities/" + req.params.id);
       }
    });
});

// DESTROY Route
router.delete("/:id", middleware.isAuthorizedUser, (req, res) => {
  City.findByIdAndRemove(req.params.id, (err) => {
      if (err){
          console.log(err);
          res.redirect('back');
      } else {
          res.redirect("/cities");
      }
  });
});

// ======== Handle Promise rejections ======
process.on('unhandledRejection', err => console.log(err.stack));

// ======= Export to app.js =============
module.exports = router;