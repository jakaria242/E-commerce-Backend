import { User } from '../models/userSchema.model.js'
import { mail } from '../utils/sendMail.js'
import verifyEmailTemplate from '../mailTemplate/verifyEmailTemplate.js'
import { cloudinaryUpload } from '../services/cloudinary.js'


// token generator start=================================
const generateTokens = async (id) =>{
   try {
     const user = await User.findById({ _id : id })
     const accessToken = await user.generateAccesstoken()
     const refreshToken =  await user.generateRefreshtoken()
     // update user with refreshToken
     user.refreshToken = refreshToken
     await user.save()
     return { accessToken, refreshToken }
   } catch (error) {
    console.log('generateTokens error: ', error);
    
   }
}
// token generator end=================================

// @desc create a user
// route POST /api/v1/user/registration
const createUser = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password } = req.body

    // check user already registered or not
    const isFound = await User.findOne({ email })
    if (isFound) {
      return res.json('email already exists')
    }

    const user = await User.create({ fullName, phoneNumber, email, password })
    const link = await user.generateAccesstoken()

    await mail(
      user.email,
      'verifycation',
      'Verify your mail',
      verifyEmailTemplate(link)
    )

    return res.json('ok')
  } catch (error) {
    console.log('create user error', error)
  }
}


// @desc User email verify
const emailVerify = async (req, res) => {
  try {
    const { link } = req.params
    const user = new User()
    const token = await user.verifyAccessToken(link)
    if (token) {
      const userFound = await User.findOne({ email: token.email })
      if (userFound) {
        if (userFound.emailVerified) {
          return res.send('Your email is all ready verified!')
        }
        userFound.emailVerified = Date.now()
        await userFound.save()
        return res.send('Your email has been verified!')
      } else {
        return res.send('User verification failed!')
      }
    } else {
      return res.send('Invalid verification url')
    }
  } catch (error) {
    console.log('emailVerify error', error)
  }
}


// @desc login a user
// route POST /api/v1/login
const login = async (req, res) => {
try {
     const {email, password} = req.body

  // Check if email and password fields are provided
     if (req.body.hasOwnProperty('email') && req.body.hasOwnProperty('password')) {
      if ([email, password].some((field) => field?.trim() === '')) {
        return res.send('all fields are required')
      }
    } else {
      return res.send('invalid')
    }

    // Find user by email
     const userFound = await User.findOne({ email })
    if (!userFound) {
      return res.send('User not found')
    }

       // Check if the email is verified
       if (!userFound.emailVerified) {
        return res.status(403).send('Email not verified. Please verify your email first.');
      }

    // Validate password
    const isPasswordCorrect = await userFound.checkPassword(password)
    if (!isPasswordCorrect) {
      return res.send('Email and Password are invalid')
    }

    // Generate access and refresh tokens
    const {accessToken, refreshToken} = await generateTokens(userFound._id)
    return res.json ({accessToken, refreshToken})

} catch (error) {
  console.log('login error', error);
 }
}

// @desc create a user
// route POST /api/v1/user/update
const userUpdate = async (req, res )=> {
   try {
    // check file uploaded or not
    if (req.file) {
      const { path } = req.file
      const user = await User.findById(req.user._id)
      if (user) {
        const result = await cloudinaryUpload(path, user.fullName, 'profileImage')
      
      // cloudinaryImage.optimizeUrl || cloudinaryImage.uploadResult || cloudinaryImage.uploadResult.public_id
        user.profileImage = result.optimizeUrl
        user.publicId = result.uploadResult.public_id
        await user.save()
        res.json("ok")
      }
     }
     
   } catch (error) {
    console.log("user update error", error);
    
   }
}

export { createUser, emailVerify, login, userUpdate }
