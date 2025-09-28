import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName:{
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

const User = mongoose.model("users", userSchema);
export default User;
