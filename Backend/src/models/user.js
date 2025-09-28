const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  passwordResetCode:{
    type:String
  },
  passwordResetCodeExpiresAt:{ 
    Date
  },
  verificationCode:{
    type:String
  },
   verificationCodeExpiresAt: {
    type: Date,
  }
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
