const User = require("../models/models.users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                message: "email not passed for verification",
            });
        }
        if (!otp) {
            return res.status(400).json({
                message: "Kindly provide your OTP",
            });
        }

        const user = await User.findOne({email});

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
        user.otp = null; // Clear OTP after successful verification
        user.otpExpires = null; // Clear OTP expiration after successful verification
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: "User verified successfully",
            token,
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isVerified: user.isVerified,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong",
        });
    }
};

module.exports = verifyOTP;
