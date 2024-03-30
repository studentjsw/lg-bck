const mongoose = require("mongoose");
// Define MongoDB schema and models for Manager
const UserSchema = new mongoose.Schema({
    userAge:{
        type:Number,
    },
    userName: {
        type: String,
        required: true,
      },
      userGender:{
        type:String,
        
      },
      userEmail: {
        type: String,
        required: true,
        unique: true, // Ensures uniqueness of the email field
      },
      userDOB:Date,
      password:String,
      userMobile:Number,
      resetToken:String,
      newPassword:String,
}, { collection: `${process.env.COLLECTION}` });
module.exports = mongoose.model("User", UserSchema);