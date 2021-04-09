const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
   body: String,
   rating: Number,
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User' // reference to a User instance //
   }
});

module.exports = mongoose.model("Review", reviewSchema);
