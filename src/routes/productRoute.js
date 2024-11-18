import express from "express";
import { protectAuth } from "../middlewares/protectAuthMiddleware.js";
import { adminAuth } from "../middlewares/adminAuthMiddleware.js";
import { pagination, productCreate, productDelete } from "../controllers/productController.js";
import { upload } from "../middlewares/multerMiddleware.js";


const router = express.Router();

router.route("/product/create").post(protectAuth,adminAuth,upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'gallery', maxCount: 4 }]), productCreate)
router.route("/product/delete/:id").delete(protectAuth, adminAuth, productDelete)
router.route("/product").get(pagination)



export default router;