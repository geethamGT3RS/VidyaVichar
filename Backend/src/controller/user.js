const User=require("../models/user")
const bcrypt = require('bcrypt');
const createUser=async (req,res)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const {name,email,password,role}=req.body;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }
    if (!PasswordRegex.test(password)) {
        return res.status(400).json({ error: "Provide a striong password" });
    } 
    const existingUser =await User.findOne({email:email});
    if(existingUser){
        return res.status(400).json({ error:"User Already exists"});
    }
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    const newuser= new User({email,password:hashed,role});
    await newuser.save();
    res.json({user:newuser})
    
}
module.exports=createUser;
