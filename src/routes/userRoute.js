import express from "express";
import { createUser, emailVerify, login, userUpdate, logout } from "../controllers/userController.js";
import { validation } from "../middlewares/creatrUserValidationMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { protectAuth } from "../middlewares/protectAuthMiddleware.js";
import { adminAuth } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.route("/user/registration").post(validation, createUser)
router.route("/user/:link").get(emailVerify)
router.route("/user/login").post( login)
router.route("/user/update").post(protectAuth,upload.single("profileImage"), userUpdate)
router.route("/user/logout").post(protectAuth, logout)


export default router;