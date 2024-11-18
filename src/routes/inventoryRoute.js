import express from "express";
import { protectAuth } from "../middlewares/protectAuthMiddleware.js";
import { adminAuth } from "../middlewares/adminAuthMiddleware.js";
import { inventoryCreate } from "../controllers/inventoryController.js";



const router = express.Router();

router.route("/inventory/create").post(protectAuth, adminAuth, inventoryCreate)




export default router;