if(process.env.NODE_ENV !== "production"){
   require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds'); 
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {       
   useNewUrlParser: true, 
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

const sessionConfig = {
   secret: 'thisshouldbeabettersecret!',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
}

app.use(session(sessionConfig));
app.use(flash());

// initialize and use passport //
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware; access in all templates //
app.use((req, res, next) => {
   console.log(req.session);
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
})

// everything starts with campgrounds; use the campgrounds rouotes as indicated above //
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
   res.render('home');
});

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
