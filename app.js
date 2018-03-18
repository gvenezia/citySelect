'use strict';


// ============= Variables =============
// Required packages
var express         = require("express"), 
    app             = express(),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    City            = require("./models/city"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
// Assign the routes
var citiesRoutes    = require("./routes/cities"),
    commentsRoutes  = require("./routes/comments"),
    authRoutes      = require("./routes/auth");

// ============= Use, Connect, Set ==================
// mongoose.connect("mongodb://localhost/citySelect"); // original local mongoDB
mongoose.connect("mongodb://user1:1234@ds215709.mlab.com:15709/city-select");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/images"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); // seeds with the data in seed.js

// ======= CONFIG: Passport ============
app.use(require("express-session")({
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
// Allows access to the current user on every page of the web site
app.use(function(req, res, next){
   res.locals.user    = req.user;
   res.locals.success = req.flash("success");
   res.locals.error   = req.flash("error");
   next();
});


// ===================
// RESTful routes (moved to separate files)
// ===================

// Root Route
app.get("/", function(req, res){
   res.render("landing");
});

app.use('/cities/', citiesRoutes);
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