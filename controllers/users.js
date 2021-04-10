const User = require('../models/user');

// renders registration form //
module.exports.renderRegister  = (req, res) => {
   res.render ('users/register');
}

// registers the user //
module.exports.register = async(req, res, next) => {
   try {
      const { email, username, password } = req.body;
      const user = new User({ email, username});
      // user is created and registered //
      const registeredUser = await User.register(user, password);
      // logging in new user via passport function //
      req.login(registeredUser, err => {
         if(err) {
           return next(err); 
         } else {
            req.flash("success", "Welcome to CampFinder!");
            res.redirect('/campgrounds');
         }
      })
   } catch (e){ // e = error or err //
      req.flash('error', e.message);
      res.redirect('register');
   }
}

// renders login form
module.exports.renderLogin = (req, res) => {
   res.render('users/login');
}

// authenticates and logs in user //
module.exports.login = (req, res) => {
   req.flash('success', 'Welcome Back!');
   const redirectUrl = req.session.returnTo || '/campgrounds';
   delete req.session.returnTo;
   res.redirect(redirectUrl);
}

// logs out user
module.exports.logout = (req, res) => {
   req.logout(); 
   req.flash('success', 'You have been logged out');
   res.redirect('/campgrounds'); 
}