import express from "express"
import cors from "cors"

const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))
app.use(cors({
    origin: "*",
    credentials: true,
}))

// all routes ================================================

import userRoute from './routes/userRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import subCategoryRoute from './routes/subCategoryRoute.js'
import productRoute from './routes/productRoute.js'
import variationRoute from './routes/variationRoute.js'
import inventoryRoute from './routes/inventoryRoute.js'

// user routes
app.use("/api/v1/",userRoute)

// category routes
app.use("/api/v1/",categoryRoute)

// subCategory routes
app.use("/api/v1/",subCategoryRoute)

// product routes
app.use("/api/v1/",productRoute)

// varitaion routes
app.use("/api/v1/",variationRoute)

// inventory routes
app.use("/api/v1/",inventoryRoute)

export default app