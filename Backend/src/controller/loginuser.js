import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare the provided password with the stored hash
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if the user's account has been verified
        if (!existingUser.isVerified) {
            return res.status(403).json({ error: "Account not verified. Please verify your account first." });
        }

        // Create a JWT payload
        const payload = {
            id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role
        };

        // Sign the token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send a successful response
        return res.status(200).json({
            message: "User logged in successfully",
            token: token,
            user: {
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
};

export default loginuser;