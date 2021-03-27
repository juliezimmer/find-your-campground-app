const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
   title: String,
   image: String,
   price: Number,
   description: String,
   location: String,
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review"
      }
   ]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
   if(doc){ //something was found and deleted //
      await Review.deleteMany({ // delete all reviews where the id field is in the doc that was just deleted //
         _id: {
            $in: doc.reviews
         }
      })
   }
})

// compiles model and exports it //
module.exports = mongoose.model('Campground', CampgroundSchema);