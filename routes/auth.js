// Express
var passport= require('passport'),
    express = require('express'),
    router  = express.Router();
    
// Models
var City    = require("../models/city"),
    Comment = require("../models/comment"),
    User    = require("../models/user");

// ================= Routes =====================
// show register form
router.get('/register', (req, res) => {
   res.render('register');
});

// handle sign-up logic
router.post('/register', (req, res) => {
   var newUser = new User({username: req.body.username});
   
   User.register(newUser, req.body.password, (err, user) => {
      if (err){
          console.log(err);
          req.flash('error', err.message);
          return res.redirect('/register');
      } else {
          passport.authenticate('local')(req, res, () => {
             req.flash('success', 'Welcome, ' + user.username);
             res.redirect('/cities');
          });
      }
   });
});

// Login routes
router.get('/login', (req, res) => {
   // if no info inputted, redirect request to the referer
    res.redirect('back');
});

// Login post route
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: "back",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){ }); // Empty callback to show that it is possible (unnecessary for now)

// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("error", "You've been logged out");
    res.redirect('/');
});

// ======= Export to app.js =============
module.exports = router;