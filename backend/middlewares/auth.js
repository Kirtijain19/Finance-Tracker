import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET; 
export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const token = authHeader.split(' ')[1];

    // to verify the token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({
                success: false,
                message: "user not found"
            });
        } 
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}