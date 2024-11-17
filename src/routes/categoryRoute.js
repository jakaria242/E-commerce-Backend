import express from "express";
import { protectAuth } from "../middlewares/protectAuthMiddleware.js";
import { adminAuth } from "../middlewares/adminAuthMiddleware.js";
import { allCategorise, categoryCreate } from "../controllers/categoryController.js";

const router = express.Router();

router.route("/categorise/create").post(protectAuth, adminAuth, categoryCreate)
router.route("/categorise").get(allCategorise)



export default router;