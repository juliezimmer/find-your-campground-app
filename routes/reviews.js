const express = require('express');
const app = express();
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');



// validateReview is Joi middleware //
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
   console.log(req.params);
   const campground = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   review.author = req.user._id;
   campground.reviews.push(review);
   await review.save();
   await campground.save();
   req.flash('success', 'Your review was successfully created!')
   res.redirect(`/campgrounds/${campground._id}`);
}))

// route to delete a review //
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req,res) => {
   const {id, reviewId } = req.params;
   await Campground.findByIdAndUpdate(id, { $pull:{ reviews: reviewId }});
   await Review.findByIdAndDelete(reviewId);
   req.flash('success', 'You successfully deleted your review')
   res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;