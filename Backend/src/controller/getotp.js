import nodemailer from 'nodemailer';
import User from "../models/user.js";

const getotp = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ error: "User with this email was not found." });
        }

        // Create a Nodemailer transporter for sending emails
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASS
            }
        });

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save the OTP and its 10-minute expiration time to the user's document
        existingUser.verificationCode = otp;
        existingUser.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await existingUser.save();

        // Configure the email's content
        const mailOptions = {
            from: `"Vidya Vichar" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Verification Code',
            html: `<p>Your verification code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Verification OTP sent successfully to your email." });

    } catch (error) {
        console.error("Error sending verification email:", error);
        res.status(500).json({ error: "Failed to send verification email." });
    }
};

export default getotp;