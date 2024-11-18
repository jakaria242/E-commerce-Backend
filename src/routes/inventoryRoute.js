import express from "express";
import { protectAuth } from "../middlewares/protectAuthMiddleware.js";
import { adminAuth } from "../middlewares/adminAuthMiddleware.js";
import { allInventory, allInventoryDelete, inventoryCreate, inventoryDelete, inventoryUpdate, singleInventory } from "../controllers/inventoryController.js";



const router = express.Router();

router.route("/inventory/create").post(protectAuth, adminAuth, inventoryCreate)
router.route("/inventory/update/:id").post(protectAuth, adminAuth, inventoryUpdate)
router.route("/inventory").get(protectAuth, adminAuth, allInventory)
router.route("/inventory/single/:id").get(protectAuth, adminAuth, singleInventory)
router.route("/inventory/delete/:id").delete(protectAuth, adminAuth, inventoryDelete)
router.route("/inventory/deleteall").delete(protectAuth, adminAuth, allInventoryDelete)




export default router;