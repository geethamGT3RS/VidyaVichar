const nodemailer = require('nodemailer');
const User = require("../models/user");

const getotp = async(req,res)=>{
    const {email} = req.body;
    const existingUser = await User.findOne({email});

    if (!existingUser) {
        return res.status(400).json({ error: "Invalid User" });
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,       
            pass: process.env.EMAIL_APP_PASS  
        }
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    existingUser.verificationCode = otp;
    existingUser.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry
    await existingUser.save();
    const mailOptions = {
        from: `"Vidya Vichar" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `<p>Your verification code is: <strong>${otp}</strong>.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully." });
};

module.exports =getotp;
