const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {         useNewUrlParser: true, 
   useCreateIndex: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("Database connected");
});

// mix the descriptors and places: picking a random element from an array //
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
   // clears the DB //
   await Campground.deleteMany({});
   // seed Logic //
   for (let i = 0; i < 50; i++){
      const random1000 = Math.floor(Math.random() * 1000);
      const camp = new Campground({
         location: `${cities[random1000].city}, ${cities[random1000].state}`,
         title: `${sample(descriptors)} ${sample(places)}`
      })
      await camp.save();
   }
}

seedDB().then(() => {
   mongoose.connection.close();

})