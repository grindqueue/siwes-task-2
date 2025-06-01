const user = require("../models/models.users");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyOTP = async (req, res) => {
    const {userId, otp } = req.body;

    try {
        if (!userId || !otp) {
            return res.status(400).json({
                message: "OTP is required",
            });
        }

        const user = await user.findById({ userId });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "OTP has expired",
            });
        }
        user.isVerified = true;
        user.otp = null; // Clear the OTP after successful verification
        user.otpExpires = null; // Clear the OTP expiration time

        await user.save();

        const token = jwt.sign(
            { userId: user._id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN } // Token expiration time
        );
        
        return res.status(200).json({
            message: "User verified successfully",
            token: token, // Return the JWT token
        });
        
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong",
        }); 
    }
}

module.exports = verifyOTP;