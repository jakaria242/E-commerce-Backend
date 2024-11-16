import express from "express";
import { protectAuth } from "../middlewares/protectAuthMiddleware.js";
import { adminAuth } from "../middlewares/adminAuthMiddleware.js";
import { subCategoryCreate } from "../controllers/subCategoryController.js";

const router = express.Router();

router.route("/subcategorise/create").post(protectAuth, adminAuth, subCategoryCreate)



export default router;