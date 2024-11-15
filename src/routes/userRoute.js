import express from "express";
import { createUser, emailVerify, login, userUpdate, logout } from "../controllers/userController.js";
import { validation } from "../middlewares/creatrUserValidationMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { protectauth } from "../middlewares/protectauthMiddleware.js";

const router = express.Router();

router.route("/user/registration").post(validation, createUser)
router.route("/user/:link").get(emailVerify)
router.route("/user/login").post( login)
router.route("/user/update").post(protectauth,upload.single("profileImage"), userUpdate)
router.route("/user/logout").post(protectauth ,logout)


export default router;