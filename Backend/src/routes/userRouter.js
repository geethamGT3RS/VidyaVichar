import express from "express";
import { signupUser, signinUser, logoutUser } from "../controller/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/logout", logoutUser);

export default router;