const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
   url: String,
   filename: String
});

// defining a virtual image
ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_150')
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
   title: String,
   images: [ImageSchema],
   geometry: {
      type: {
         type: String,
         enum: ['Point'],
         required: true
      },
      coordinates: {
         type: [Number], 
         required: true
      }
   },
   price: Number,
   description: String,
   location: String,
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review"
      }
   ]
}, opts);

// registers a virtual property in/on the CampgroundSchema //
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
   return `<a href="/campgrounds/${this._id}">${this.title}</a>
   <p>${this.description.substring(0, 20)}...</p>`
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