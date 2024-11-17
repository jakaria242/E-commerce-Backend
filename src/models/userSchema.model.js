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

// hash password start ================================
userSchema.pre('save', async function (next) {
  // only run thus function if password was actually modified
  if (this.isModified('password')) {
    // hash password with cost of 10
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})
// hash password end ================================

// password chackmethods start ================================
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}
// password chackmethods end ================================

// generate accessToken and refreshToken start ===============================
userSchema.methods.generateAccesstoken = async function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  )
}
userSchema.methods.generateRefreshtoken = async function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  )
}

// generate accessToken and refreshToken end ===============================

// jwt token verification start ============================
userSchema.methods.verifyAccessToken = async function (token) {
  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, decoded) {
      if (err) {
        return null
      }
      return decoded
    }
  )
}
// jwt token verification end ============================

export const User = mongoose.model('User', userSchema)
