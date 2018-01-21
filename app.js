// Assign the required packages to variables
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// Going to a DB, but put in the global scope for now so that we can use the variables
var citiesArr = [
        {name: "St. Louis", image: "https://upload.wikimedia.org/wikipedia/commons/d/d0/St._Louis_skyline_September_2008.jpg"},
        {name: "New Orleans", image: "https://upload.wikimedia.org/wikipedia/commons/b/ba/St._Louis_Cathedral_%28New_Orleans%29.jpg"},
        {name: "Chicago", image: "https://c1.staticflickr.com/5/4248/34001904163_206220b8fd_b.jpg"},
    ]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
   res.render("landing");
});

app.get("/cities", function(req, res){
    res.render("cities", {citiesArr: citiesArr});
});

// Allow users to create a new city
app.post("/cities", function(req, res){
   var name = req.body.name;
   var img = req.body.img;
   
   citiesArr.push({"name": name, "image": img});
   res.redirect("/cities");
});

app.get("/cities/new", function(req, res) {
   res.render("new");
});

// Check that the server is running successfully
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The citySelect app is running");
});