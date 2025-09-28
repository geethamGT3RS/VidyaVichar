const express=require("express")
const createUser = require("../controllers/user")
const loginuser=require("../controllers/loginuser")
const getotp=require("../controllers/getotp")
const verifyotp=require("../controllers/verifyotp")
const forgetpassword= require("../controllers/forgetpasswordotp")
const resetpassword=require("../controllers/resetPassword")
const router=express.Router()
router.post("/createuser",createUser);
router.post("/",loginuser);
router.post("/getotp",getotp);
router.post("/verifyotp",verifyotp);
router.post("/forgetpasswordotp",forgetpassword)
router.post("/resetpassword",resetpassword)
module.exports=router;  