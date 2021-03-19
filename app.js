const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {         useNewUrlParser: true, 
   useCreateIndex: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("Database connected");
});

const app = express();

// tells express to use the ejs-mate engine //
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
   res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
   const campgrounds = await Campground.find({});
   res.render('campgrounds/index', { campgrounds });
}))

// route to serve new campgrounds form //
app.get('/campgrounds/new', (req, res) => {
   res.render('campgrounds/new');
})

// endpoint where new campground form is submitted //
app.post('/campgrounds', catchAsync(async(req, res, next) => {
   if(! req.body.campgrounds) throw new ExpressError('Invalid Campground Data', 400);
   const campground = new Campground(req.body.campground);
   await campground.save();
   // redirects to detail page //
   res.redirect(`/campgrounds/${campground._id}`);
}))

// route to get details about a specific campground //
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
   const campground = await Campground.findById(req.params.id);
   res.render('campgrounds/show', { campground });
}))

// route that serves edit form that will look up campground by id //
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
   const campground = await Campground.findById(req.params.id);
   res.render('campgrounds/edit', { campground });
}))

// route to serve edit form //
app.put('/campgrounds/:id', catchAsync(async(req, res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
   // redirects to details page of updated campground //
   res.redirect(`/campgrounds/${campground._id}`);
}));

// route to delete a campground //
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndDelete(id);
   res.redirect('/campgrounds');
}))

// Uses Error Class //
// covers all paths //
app.all('*', (req, res, next) => {
   next(new ExpressError("page not found", 404)) // can use in app.use() //
})

// error handling function //
// ExpressError is passed down to this function to process //
app.use((err, req, res, next) => {
   // destructure from error and provide default value //
   const { statusCode = 500 } = err;
   if(!err.message) err.message = "Something went wrong"
   // statusCode and message are now available for use //
   res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
   console.log("Listening on port 3000");
})
