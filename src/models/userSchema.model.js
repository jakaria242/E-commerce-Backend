import { mongoose, Schema } from 'mongoose'

const userSchema = new Schema({
    displayName: {
        type: String,
        required: [true, 'name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase : true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'email is required'],
        minlength: [8, 'password must be at least 8 characters long'],
        select: false,
    },
    phonNumber: {
        type: String,
        unique: true
    },
    emailVerified: {
        type: Date,
    },
    resetPasswordToken: {
        type: String,
    },
    gender: {
        type: String,
        enum : ['male', 'female', 'other'],
        lowercase: true,
    },
    role: {
        type: String,
        enum : ['user', 'seller', 'admin', 'aditor'],
        default: 'user',
        lowercase: true,
    },
    birthday: {
        type: String,
    },
    address: [
        {
            district: String
        },
        {
            street: String
        },
        {
            postCode: String
        },
        {
            country: String
        }
    ],
},{
    timestamps: true,
})

export const User = mongoose.model("User", userSchema)