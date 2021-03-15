const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
   title: String,
   image: String,
   price: Number,
   description: String,
   location: String
});

// compiles model and exports it //
module.exports = mongoose.model('Campground', CampgroundSchema);