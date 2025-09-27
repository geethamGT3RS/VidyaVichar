const User = require("../models/user");
const verifyotp=async(req,res)=>{
    const{email,otp}=req.body;
    const existingUser = await User.findOne({ email });
   if (!existingUser) {
        return res.status(400).json({ error: "User not found." });
    }
    if (existingUser.verificationCode !== otp || existingUser.verificationCodeExpiresAt < new Date()) {
        return res.status(400).json({ error: "Invalid or expired OTP." });
    }
    existingUser.isVerified = true;
    existingUser.verificationCode = undefined;
    existingUser.verificationCodeExpiresAt = undefined;
    await existingUser.save();
    res.status(200).json({ message: "Account verified successfully. You can now log in." });
};
module.exports =verifyotp;
