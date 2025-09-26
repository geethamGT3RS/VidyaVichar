import User from "../models/userModel.js";

async function getUserNameByEmail(email) {
    const user = await User.findOne({ email: email }, { userName: 1, _id: 0 }).lean();
    if (!user || !user.userName) {
        throw new Error(`User not found for email: ${email}`);
    }
    return user.userName;
}

export default getUserNameByEmail;