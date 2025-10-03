import User from "../models/user.js";
import bcrypt from 'bcrypt';

const createUser = async (req, res) => {
    // Regular expressions for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const { name, email, password, role } = req.body;

    // Validate email format
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password strength
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password is not strong enough. It must be 8+ characters with uppercase, lowercase, numbers, and special characters." });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create and save the new user
        //const newUser = new User({ name, email, password: hashedPassword, role });
        const newUser = new User({ userName: name, email:email, password: hashedPassword, role:role });
        await newUser.save();

        // Send response
        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUserEmailByName = async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: "A 'name' query parameter is required." });
    }

    try {
        const user = await User.findOne({ userName: name }).select('email -_id');

        if (!user) {
            return res.status(404).json({ error: "User with that name was not found." });
        }
        res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching user email by name:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


const getUserNameByEmail = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "An 'email' query parameter is required." });
    }

    try {
        // FIX: Select 'userName' to match your database schema.
        const user = await User.findOne({ email: email }).select('userName -_id');

        if (!user) {
            return res.status(404).json({ error: "User with that email was not found." });
        }
        
        // This will now correctly return an object like: { userName: 'Bidisha Shaw' }
        res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching user name by email:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export  {createUser , getUserEmailByName, getUserNameByEmail};