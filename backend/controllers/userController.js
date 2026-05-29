import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

const createToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long"
        });
    }


    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });
        const token = createToken(user._id);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// login a user

export async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


// to get user details
export async function getUserProfile(req, res) {
    const userId = req.user?._id;
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    } 

}


// to update user details
export async function updateUserProfile(req, res) {
    const userId = req.user?._id;
    const { name, email } = req.body; 
    if(!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Name and valid email are required"
        });
    } 

    try{
        const exists=await User.findOne({ email, _id: { $ne: userId } });
        if(exists) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }
        const user=await User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true }).select("-password");
        res.status(200).json({
            success: true,
            message: "User details updated successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


// to change password
export async function updateUserPassword(req, res) {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;  
    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Current password and new password (at least 8 characters) are required"
        });
    }  
    try {
        const user = await User.findById(userId).select("password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }           
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    }
    catch (error) {     
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}