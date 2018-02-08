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
    
// Assign the routes
var citiesRoutes    = require("./routes/cities"),
    commentsRoutes  = require("./routes/comments"),
    authRoutes      = require("./routes/auth");

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


// ===================
// RESTful routes (moved to separate files)
// ===================

// Root Route
app.get("/", function(req, res){
   res.render("landing");
});

app.use('/cities', citiesRoutes);
app.use('/cities/:id/comments', commentsRoutes);
app.use(authRoutes);

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