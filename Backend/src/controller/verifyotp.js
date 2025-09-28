import User from "../models/user.js";

const verifyotp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the OTP is valid and not expired
        const isOtpValid = existingUser.verificationCode === otp;
        const isOtpExpired = existingUser.verificationCodeExpiresAt < new Date();

        if (!isOtpValid || isOtpExpired) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        // Update user status
        existingUser.isVerified = true;
        existingUser.verificationCode = undefined;
        existingUser.verificationCodeExpiresAt = undefined;

        await existingUser.save();

        res.status(200).json({ message: "Account verified successfully. You can now log in. ✅" });

    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
};

export default verifyotp;