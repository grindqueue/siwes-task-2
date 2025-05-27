const user = require("../models/models.users");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyOTP = async (req, res) => {
    const { otp } = req.body;

    try {
        if (!otp) {
            return res.status(400).json({
                message: "OTP is required",
            });
        }

        if (req.body.otp === otp && otpExpires > Date.now()) {
            newUser.isVerified = true; 
            newUser.otp = undefined;
            await newUser.save();
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            res.json({
                message : "User created successfully",
                token,
                userName : newUser.userName,
            })
        }
        
        res.status(400).json({
            message : "Invalid OTP",
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong",
        }); 
    }
}

module.exports = verifyOTP;