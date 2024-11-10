import { mongoose, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'email is required'],
      minlength: [8, 'password must be at least 8 characters long'],
      select: false,
    },
    emailVerified: {
      type: Date,
    },
    profileImage: {
      type: String,
    },
    publicId: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['user', 'seller', 'admin', 'editor'],
      default: 'user',
      lowercase: true,
    },
    birthday: {
      type: String,
    },
    address: [
      {
        district: String,
      },
      {
        street: String,
      },
      {
        postCode: String,
      },
      {
        country: String,
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {

    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.methods.generateAccesstoken = async function () {
  return jwt.sign({
    id: this._id,
    email: this.email
  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE });
}
userSchema.methods.generateRefreshtoken = async function () {
  return  jwt.sign({
    id: this._id,
    email: this.email
  }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE });
}

export const User = mongoose.model('User', userSchema)
