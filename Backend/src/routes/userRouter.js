import express from "express";

// Import controller functions from their respective files
import {createUser, getUserEmailByName, getUserNameByEmail }from "../controller/userController.js";
import loginuser from "../controller/loginuser.js";
import getotp from "../controller/getotp.js";
import verifyotp from "../controller/verifyotp.js";
import forgetpassword from "../controller/forgetpasswordotp.js";
import resetpassword from "../controller/resetPassword.js";

const router = express.Router();

// Define routes
router.post("/createuser", createUser);
router.post("/", loginuser);
router.post("/getotp", getotp);
router.post("/verifyotp", verifyotp);
router.post("/forgetpasswordotp", forgetpassword);
router.post("/resetpassword", resetpassword);
router.get("/getuseremail", getUserEmailByName);
router.get("/getusername", getUserNameByEmail);

// Export the router
export default router;