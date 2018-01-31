// Assign the required packages to variables
var express     = require("express"), 
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    City        = require("./models/city.js"),
    seedDB      = require("./seeds.js");

mongoose.connect("mongodb://localhost/citySelect");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB();

app.get("/", function(req, res){
   res.render("landing");
});

// INDEX Route - Show all cities
app.get("/cities", function(req, res){
    // Get the cities from the DB
    City.find({}, function(err, DBcities){
        if(err){
            console.log("Error while retrieving the cities");
            console.log(err);
        } else {
            res.render("index", {cities:DBcities});
        }
    });
});

// CREATE Route - Allow users to create a new city
app.post("/cities", function(req, res){
   var  name        = req.body.name,
        image       = req.body.image,
        description = req.body.description,
        newCity     = {name:name, image:image, description:description};
   
   City.create(newCity, function(err, newCity){
      if(err){
            console.log("Error while adding a city");
            console.log(err);
        } else {
           // Redirect   
           res.redirect("/cities");
        }
   });
});

// NEW - Shows the form to add a new city
app.get("/cities/new", function(req, res) {
   res.render("new");
});

// SHOW - Display a page for a specific city
app.get("/cities/:id", function(req, res){
   City.
    findById(req.params.id).
    populate('comments').
    exec( function(err, foundCity){
      if (err){
          console.log(err);
      } else {
          console.log(foundCity);
          res.render("show", {city:foundCity});
      }
   });
});

// Check that the server is running successfully
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The citySelect app is running");
});