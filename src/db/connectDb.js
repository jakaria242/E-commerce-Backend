import mongoose from "mongoose"
import { dbUrl } from './../config/index.js'

const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl)
    console.log("Database Connected")
  } catch (error) {
    console.log("connect database error",error.message)
  }
}
export default connectDb