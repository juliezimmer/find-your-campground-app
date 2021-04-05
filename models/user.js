const mongoose - require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// define user schema //
const UserSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true
   }
});

// this will define user name and password //
UserSchema.plugin(passportLocalMongoose);

// compile and export the model //
module.exports = mongoose.model("User", UserSchema);