import User from "../models/user.js";
import bcrypt from 'bcrypt';

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Regular expression for a strong password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ error: "Password is not strong enough. It must be 8+ characters with uppercase, lowercase, numbers, and special characters." });
        }

        // Find the user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the OTP is valid and not expired
        const isOtpValid = existingUser.passwordResetCode === otp;
        const isOtpExpired = existingUser.passwordResetCodeExpiresAt < new Date();

        if (!isOtpValid || isOtpExpired) {
            return res.status(400).json({ error: "Invalid or expired OTP. Please request a new one." });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        existingUser.password = hashedPassword;

        // Clear the reset code fields
        existingUser.passwordResetCode = undefined;
        existingUser.passwordResetCodeExpiresAt = undefined;

        await existingUser.save();

        res.status(200).json({ message: "Password has been reset successfully." });

    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
};

export default resetPassword;