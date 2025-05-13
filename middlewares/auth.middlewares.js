const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const mongoose = require("mongoose");
const User = require("../models/models.users");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const authorize = async (req, res, next) => {
    try{
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "You are not authorized to access this resource",
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "You are not authorized to access this resource",
            });
        }
        req.user = user;
        next(); 
    }catch (error) {
        return res.status(401).json({
            message: error.message || "You are not authorized to access this resource",
        });
    }
}
module.exports = authorize;