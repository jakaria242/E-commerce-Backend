import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'jakaria.dev242@gmail.com',
    pass: 'xemd cwgc nhgf jsns',
  },
})

// async..await is not allowed in global scope, must use a wrapper
export async function mail(to, subject, text = '', html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Jakaria islam 👻" <youarehacke@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  })

  console.log('Message sent: %s', info.messageId)
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
