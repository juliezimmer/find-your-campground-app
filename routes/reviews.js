const express = require('express');
const app = express();
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

// middleware for review validation //
const validateReview = (req, res, next) => {
   const {error} = reviewSchema.validate(req.body);
   if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400) // should be caught and passed down to app.use //
   } else {
      next();
   }
}

// validateReview is Joi middleware //
router.post('/', validateReview, catchAsync(async (req, res) => {
   console.log(req.params);
   const campground = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   campground.reviews.push(review);
   await review.save();
   await campground.save();
   res.redirect(`/campgrounds/${campground._id}`);
}))

// route to delete a review //
router.delete('/:reviewId', catchAsync(async(req,res) => {
   const {id, reviewId } = req.params;
   await Campground.findByIdAndUpdate(id, { $pull:{ reviews: reviewId }});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;