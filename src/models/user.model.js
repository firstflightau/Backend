const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // Ensures email is unique
      match: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, // Validates email format
    },
    otp: {
      type: Number,
      default: null, // Can be null when OTP is not in use
    },
    otpExpiry: {
      type: Date,
      default: null, // Can be null when OTP is not in use
    },
    isAdmin: {
      type:Boolean,
      default:false,
    },
    isActive: {
      type:Boolean,
      default:false,
    },
    profilePic:{
      type:String,
      default:"",
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;