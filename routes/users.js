const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
// controller //
const users = require('../controllers/users');

router.route('/register')
// renders registration form //
   .get( users.renderRegister)
// registers the user in DB//
   .post(catchAsync(users.register));

router.route('/login')
// renders login form //
   .get(users.renderLogin)
// logs in user and authenticates credentials //
   .post(passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), users.login);

// logs out user //
router.get('/logout', users.logout);

module.exports = router;