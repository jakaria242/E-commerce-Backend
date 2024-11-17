import express from "express";
import { protectAuth } from "../middlewares/protectAuthMiddleware.js";
import { adminAuth } from "../middlewares/adminAuthMiddleware.js";
import { productCreate } from "../controllers/productController.js";


const router = express.Router();

router.route("/product/create").post(productCreate)




export default router;