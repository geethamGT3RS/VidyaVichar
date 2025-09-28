const User = require("../models/user");
const bcrypt = require('bcrypt');

const resetPassword = async (req, res) => {
    const {email,otp,newPassword } = req.body;
    const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!PasswordRegex.test(newPassword)) {
        return res.status(400).json({ error: "Provide a strong password" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(400).json({ error: "Invalid request" });
    }
    if (existingUser.passwordResetCode !== otp || existingUser.passwordResetCodeExpiresAt < new Date()) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
    }    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    existingUser.password = hashedPassword;
    existingUser.passwordResetCode = undefined;
    existingUser.passwordResetCodeExpiresAt = undefined;
    await existingUser.save();
    res.status(200).json({ message: "Password reset successfully" });
};

module.exports = resetPassword;
