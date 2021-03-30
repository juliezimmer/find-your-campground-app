const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds'); 
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {       useNewUrlParser: true, 
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false
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
app.use(express.static(path.join(__dirname, 'public')));

// everything starts with campgrounds; use the campgrounds rouotes as indicated above //
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


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
