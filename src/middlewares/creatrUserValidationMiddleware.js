export const validation = (req, res, next) => {
try {
    const { fullName, phoneNumber, email, password } = req.body
  
    if (
      req.body.hasOwnProperty('fullName') &&
      req.body.hasOwnProperty('phoneNumber') &&
      req.body.hasOwnProperty('email') &&
      req.body.hasOwnProperty('password')
    ) {
      if (
        [fullName, phoneNumber, email, password].some(
          (field) => field?.trim() === ''
        )
      ) {
        return res.json('all fields are required')
      }
    } else {
      return res.json('invalid')
    }
  
    next()
} catch (error) {
  console.log("validation error", error);
  
}
}
