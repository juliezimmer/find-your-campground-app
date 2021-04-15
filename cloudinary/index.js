const cloudinary = require ('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_KEY,
   api_secret: process.env.CLOUDINARY_SECRET 
});

// Instantiate an instance of cloudinary storage
const storage = new CloudinaryStorage ({
   cloudinary,
   params: {
      folder:'CampFinder',
      allowedFormats: ['jpeg', 'png', 'jpg']
   }
});

module.exports = {
   cloudinary, // the configured cloudinary instance
   storage // setup with the cloudinary credentials
}