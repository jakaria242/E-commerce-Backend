import express from "express"
import cors from "cors"

const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))
app.use(cors({
    origin: '*',
    credentials: true,
}))

// all routes ================================================

import userRoute from './routes/userRoute.js'

// user routes
app.use("/api/v1/",userRoute)

export default app