const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');

// render the registration form //
router.get('/register', (req, res) => {
   res.render ('users/register');
});

// This is just registering a user //
router.post('/register', catchAsync(async(req, res) => {
   try {
      const { email, username, password } = req.body;
      const user = new User({ email, username});
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to CampFinder!");
      res.redirect('/campgrounds');
   } catch (e){ // e = error or err //
      req.flash('error', e.message);
      res.redirect('register');
   }
}));

// serves login form //
router.get('/login', (req, res) => {
   res.render('users/login');
});

// actually logs in the user and checks credentials //
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
   req.flash('success', 'Welcome Back!');
   res.redirect('/campgrounds');
})

module.exports = router;