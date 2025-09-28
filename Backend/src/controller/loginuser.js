const User = require("../models/user")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const loginuser = async (req, res) => {
    const { email, password } = req.body;  
    const existingUser = await User.findOne({ email: email });
    
    if (!existingUser) {
        return res.status(400).json({ error: "Invalid user or password" });
    }
    
    const newPassword = await bcrypt.compare(password, existingUser.password);
    if (!newPassword) {
        return res.status(400).json({ error: "Invalid user or password" });
    }
    
    if (!existingUser.isVerified) {
        return res.status(403).json({ error: "Account not verified. Please check your email and verify your OTP." });
    }
    
    const token = jwt.sign(
        { id: existingUser._id, email: existingUser.email, role: existingUser.role },
        process.env.JWT_SECRET,
    );
    
    return res.status(200).json({
        message: "User logged in successfully",
        token: token,
        user: {
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role
        }
    });
}

module.exports = loginuser;
