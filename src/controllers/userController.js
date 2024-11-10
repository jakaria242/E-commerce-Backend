import { User } from '../models/userSchema.model.js'
import { mail } from '../utils/sendMail.js'
import verifyEmailTemplate from '../mailTemplate/verifyEmailTemplate.js'

const createUser = async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body

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
}

const emailVerify = async (req, res) => {
  try {
    const { link } = req.params
    const user = new User()
    const { email } = await user.verifyAccessToken(link)
    if (email) {
      const userFound = await User.findOne({ email })
      if (userFound) {
       return res.send('verified')
      } else {
       return res.send('invalid')
      }
    } else {
     return res.send('invalid url')
    }
  } catch (error) {
    console.log('emailVerify error', error)
  }
}

export { createUser, emailVerify }
