// Assign the required packages to variables
var express     = require("express"), 
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

// Going to a DB, but put in the global scope for now so that we can use the variables
var citiesArr = [
        {name: "St. Louis", image: "https://upload.wikimedia.org/wikipedia/commons/d/d0/St._Louis_skyline_September_2008.jpg"},
        {name: "New Orleans", image: "https://upload.wikimedia.org/wikipedia/commons/b/ba/St._Louis_Cathedral_%28New_Orleans%29.jpg"},
        {name: "Chicago", image: "https://c1.staticflickr.com/5/4248/34001904163_206220b8fd_b.jpg"},
    ];

mongoose.connect("mongodb://localhost/citySelect");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Set up Schema
var citySchema = new mongoose.Schema({
   name: String,
   image: String
});

// Make a Model
var City = mongoose.model("City", citySchema); 

// City.create(
//     {
//         name: "New Orleans",
//         image: "https://upload.wikimedia.org/wikipedia/commons/b/ba/St._Louis_Cathedral_%28New_Orleans%29.jpg"
//     }, function(err, city){
//         if(err){
//             console.log("Error while creating the city");
//             console.log(err);
//         } else {
//             console.log("Successfully created:");
//             console.log(city);
//         }
// });

app.get("/", function(req, res){
   res.render("landing");
});

app.get("/cities", function(req, res){
    // Get the cities from the DB
    City.find({}, function(err, DBcities){
        if(err){
            console.log("Error while retrieving the cities");
            console.log(err);
        } else {
            res.render("cities", {cities:DBcities});
        }
    });
});

// Allow users to create a new city
app.post("/cities", function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var newCity = {name:name, image:image}
   
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

app.get("/cities/new", function(req, res) {
   res.render("new");
});

// Check that the server is running successfully
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The citySelect app is running");
});