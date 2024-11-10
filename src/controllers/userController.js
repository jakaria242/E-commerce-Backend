import { User } from '../models/userSchema.model.js'
import { mail } from '../utils/sendMail.js'
import verifyEmailTemplate from '../mailTemplate/verifyEmailTemplate.js'

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

const emailVerify = async (req, res) => {
  try {
    const { link } = req.params
    const user = new User()
    const token = await user.verifyAccessToken(link)
    if (token) {
      const userFound = await User.findOne({ email: token.email })
      if (userFound) {
        userFound.emailVerified = new Date().toDateString()
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

export { createUser, emailVerify }
