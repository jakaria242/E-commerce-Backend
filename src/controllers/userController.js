import { User } from '../models/userSchema.model.js'
import { mail } from '../utils/sendMail.js'
import verifyEmailTemplate from '../mailTemplate/verifyEmailTemplate.js'


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
// route POST /api/v1/user
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
  
     if (
      req.body.hasOwnProperty('email') &&
      req.body.hasOwnProperty('password')
    ) {
      if (
        [email, password].some(
          (field) => field?.trim() === ''
        )
      ) {
        return res.send('all fields are required')
      }
    } else {
      return res.send('invalid')
    }

     const userFound = await User.findOne({ email })
    if (!userFound) {
      return res.send('User not found')
    }
    const isPasswordCorrect = await userFound.checkPassword(password)
    if (!isPasswordCorrect) {
      return res.send('Email and Password are invalid')
    }
    const {accessToken, refreshToken} = await generateTokens(userFound._id)
    return res.json ({accessToken, refreshToken})

} catch (error) {
  console.log('login error', error);
 }
}


const userUpdate = async (req, res )=> {
   console.log("userUpdate",req.file);
   
}

export { createUser, emailVerify, login, userUpdate }
