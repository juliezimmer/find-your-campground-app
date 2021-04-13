const express = require('express');
const router = express.Router();
// controller //
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'});

const Campground = require('../models/campground');

router.route('/') // both routes use '/' path //
   .get(catchAsync(campgrounds.index))
   // endpoint where new campground form is submitted //
   // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
   .post(upload.array('image'),(req, res) => {
      console.log(req.body, req.files);
      res.send("It worked!");
   })

// route to serve new campgrounds form //
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
//route to get to show/details page for a specific campground//
   .get(catchAsync(campgrounds.showCampground))
   // route to serve edit form //
   .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
   // route to delete a campground //
   .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//route that serves edit form that will look up campground by id//
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;