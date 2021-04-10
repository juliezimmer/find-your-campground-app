const Campground = require('../models/campground');
const Review = require('../models/review');

// route to create a campground review //
module.exports.createReview = async (req, res) => {
   console.log(req.params);
   const campground = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   review.author = req.user._id;
   campground.reviews.push(review);
   await review.save();
   await campground.save();
   req.flash('success', 'Your review was successfully created!')
   res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req,res) => {
   const {id, reviewId } = req.params;
   await Campground.findByIdAndUpdate(id, { $pull:{ reviews: reviewId }});
   await Review.findByIdAndDelete(reviewId);
   req.flash('success', 'You successfully deleted your review')
   res.redirect(`/campgrounds/${id}`);
}