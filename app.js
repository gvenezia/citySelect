// Assign the required packages to variables
var express         = require("express"), 
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    City            = require("./models/city.js"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

// ===============================
mongoose.connect("mongodb://localhost/citySelect");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

// ======= CONFIG: Passport ============
app.use(require('express-session')({
    secret: "No secrets here, sorry",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==== set res.locals middleware ====
app.use(function(req, res, next){
   res.locals.user = req.user;
   next();
});


// ============ ROUTES ===============
// Root Route
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
            res.render("cities/index", {cities:DBcities});
        }
    });
});

// NEW - Shows the form to add a new city
app.get("/cities/new", function(req, res){
    res.render("cities/new");
});

// CREATE Route - Allow users to create a new city
app.post("/cities", function(req, res){
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
           res.redirect("/cities");
        }
   });
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
                res.render("cities/show", {city:foundCity});
            }
        });
});

// RESTFUL ROUTES NEEDED:
    // DESTROY
    // EDIT
    // UPDATE

// ===================
// COMMENTS ROUTES
// ===================

// NEW comment
app.get("/cities/:id/comments/new", isLoggedIn, function(req, res){
   City.findById(req.params.id, function(err, foundCity){
       if (err){
           console.log(err);
       } else {
           res.render("comments/new", {city:foundCity});
       }
   });
});

// CREATE comment
app.post("/cities/:id/comments", isLoggedIn, function(req, res){
    City.findById(req.params.id, function(err, foundCity){
        if (err) {
            console.log(err);
            res.redirect("/cities");
        } else {
            Comment.create(req.body.comment, function(err, newComment){
                if (err){
                    console.log(err)
                } else {
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


// ===================
//  End RESTful routes
// ===================


// AUTH ROUTES =======
// ===================

// show register form
app.get('/register', function(req, res){
   res.render('register');
});

// handle sign-up logic
app.post('/register', function(req, res){
   var newUser = new User({username: req.body.username});
   
   User.register(newUser, req.body.password, function(err, user){
      if (err){
          console.log(err);
          return res.render('register');
      } else {
          passport.authenticate('local')(req, res, function(){
             res.redirect('/cities');
          });
      }
   });
});

// Login routes
app.get('/login', function(req, res){
   // if no info inputted, redirect request to the referer
    res.redirect('back');
});

// Login post route
app.post('/login', passport.authenticate('local', 
    {
        successRedirect: "/cities",
        failureRedirect: "/login"
    }), function(req, res){ }); // Empty callback to show that it is possible (unnecessary for now)

// logout
app.get('/logout', function(req, res){
    req.logout(); 
    res.redirect('/');
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

// ===========================
// Handle a 404 error
app.use(function (req, res, next) {
  res.status(404).send("404 Error: Sorry can't find that!");
});


// ===========================

// Check that the server is running successfully
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The citySelect app is running");
});