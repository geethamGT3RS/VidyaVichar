const express=require("express")
const createUser = require("../controllers/user")
const loginuser=require("../controllers/loginuser")
const getotp=require("../controllers/getotp")
const verifyotp=require("../controllers/verifyotp")
const router=express.Router()
router.get('/',(req,res)=>{
    res.send("<h1>Hello form the backend</h1>")
})
router.post("/createuser",createUser);
router.post("/login",loginuser);
router.post("/getotp",getotp);
router.post("/verifyotp",verifyotp);
router.post
module.exports=router;  