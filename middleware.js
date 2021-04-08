module.exports.isLoggedIn = (req, res, next) => {
   console.log("req.user...", req.user);
   if(!req.isAuthenticated()){
      req.flash('error', 'You must be signed in');
      return res.redirect('/login'); // takes user to login page //
   }
   next(); 
}




