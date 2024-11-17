import express from "express";
import { protectAuth } from "../middlewares/protectAuthMiddleware.js";
import { adminAuth } from "../middlewares/adminAuthMiddleware.js";
import { allSubCategorise, subCategoryCreate } from "../controllers/subCategoryController.js";

const router = express.Router();

router.route("/subcategorise/create").post(protectAuth, adminAuth, subCategoryCreate)
router.route("/subcategorise").get(allSubCategorise)



export default router;