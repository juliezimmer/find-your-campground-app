const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError')
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
   if(!req.isAuthenticated()){
      req.session.returnTo = req.originalUrl;
      req.flash('error', 'You must be signed in');
      return res.redirect('/login'); //takes user to login page//
   }
   next(); 
}

// Joi middleware //
module.exports.validateCampground = (req, res, next) => {
   // validate campground data with Joi schema //
   const { error } = campgroundSchema.validate(req.body);
      if(error){
         const msg = error.details.map(el => el.message).join(',')
         throw new ExpressError(msg, 400) // should be caught and passed down to app.use //
      } else {
         next();
      }
}

// authorizing middleware //
module.exports.isAuthor = async(req, res, next) => {
   const { id } = req.params;
   const campground = await Campground.findById(id);
   if(!campground.author.equals(req.user._id)) {
      req.flash('error', 'You do not have edit permission');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
}

// middleware for review validation //
module.exports.validateReview = (req, res, next) => {
   const {error} = reviewSchema.validate(req.body);
   if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400) // should be caught and passed down to app.use //
   } else {
      next();
   }
}

// middleware authorizing review writer //
module.exports.isReviewAuthor = async(req, res, next) => {
   const { id, reviewId } = req.params;
   const review = await Review.findById(reviewId);
   if(!review.author.equals(req.user._id)) {
      req.flash('error', 'You do not have editing permission');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
}


