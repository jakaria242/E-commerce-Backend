import express from "express";
import { protectAuth } from "../middlewares/protectAuthMiddleware.js";
import { adminAuth } from "../middlewares/adminAuthMiddleware.js";
import { variationCreate } from "../controllers/variationController.js";


const router = express.Router();

router.route("/variation/create").post(protectAuth, adminAuth, variationCreate)




export default router;