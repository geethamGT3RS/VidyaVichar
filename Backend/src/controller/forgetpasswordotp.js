import nodemailer from 'nodemailer';
import User from "../models/user.js";

const forgetpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ error: "User with this email was not found." });
        }

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASS
            }
        });

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP and its expiration time (10 minutes from now)
        existingUser.passwordResetCode = otp;
        existingUser.passwordResetCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await existingUser.save();

        // Define email content
        const mailOptions = {
            from: `"Vidya Vichar" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Code',
            html: `<p>Your password reset code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Password reset OTP sent successfully to your email." });

    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ error: "Failed to send password reset email." });
    }
};

export default forgetpassword;