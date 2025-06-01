const User = require("../models/models.users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyOTP = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        if (!userId || !otp) {
            return res.status(400).json({
                message: "User ID and OTP are required",
            });
        }

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (existingUser.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        if (existingUser.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "OTP has expired",
            });
        }

        existingUser.isVerified = true;
        existingUser.otp = null;
        existingUser.otpExpires = null;

        await existingUser.save();

        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: "User verified successfully",
            token,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong",
        });
    }
};

module.exports = verifyOTP;
