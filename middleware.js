module.exports.isLoggedIn = (req, res, next) => {
   if(!req.isAuthenticated()){
      req.flash('error', 'You must be signed in to add a new campground');
      return res.redirect('/login'); // takes user to login page //
   }
   next(); 
}




