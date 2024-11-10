import express from "express";
import { createUser, emailVerify } from "../controllers/userController.js";
import { validation } from "../middlewares/creatrUserValidationMiddleware.js";

const router = express.Router();

router.route("/user").post(validation, createUser)
router.route("/user/:link").get(emailVerify)


export default router;