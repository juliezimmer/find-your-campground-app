const express = require('express');
const app = express();
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const Campground = require('../models/campground');


router.get('/', catchAsync(async (req, res) => {
   const campgrounds = await Campground.find({});
   res.render('campgrounds/index', { campgrounds });
}));

// route to serve new campgrounds form //
router.get('/new', isLoggedIn, (req, res) => {
   res.render('campgrounds/new');
})

// endpoint where new campground form is submitted //
router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
   const campground = new Campground(req.body.campground);
   campground.author = req.user._id;
   await campground.save();
   req.flash('success', 'You successfully added a new campground');
   // redirects to detail page //
   res.redirect(`/campgrounds/${campground._id}`);
}))

// route to get to show/details page for a specific campground //
router.get('/:id', catchAsync(async (req, res) => {
   const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
   console.log(campground);
   if(!campground){
      req.flash('error', 'That campground cannot be found');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/show', { campground  });
}));

//route that serves edit form that will look up campground by id//
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
   const { id } = req.params;
   if(!campground.author.equals(req.user._id)) {
      req.flash('error', "You don't have permission to edit");
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/edit', { campground });
}))

// route to serve edit form //
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
   req.flash('success', 'You successfully updated this campground')
   res.redirect(`/campgrounds/${campground._id}`);
}));

// route to delete a campground //
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndDelete(id);
   req.flash('success', 'You successfully deleted a campground');
   res.redirect('/campgrounds');
}));

module.exports = router;