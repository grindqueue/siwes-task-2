const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const User = require("../models/models.users");

const {sendEmail, generateOTP} = require("../middlewares/nodemailer.middleware");



const signUp = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log(req.body)
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "Kindly provide your first name, last name, email and password",
            })
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email address is already linked to an account",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;
        const [ newUser ] = await User.create([{ firstName, lastName, email, password: hashedPassword , otp, otpExpires, isAdmin}], { session })
        const token = jwt.sign( {userId: newUser._id}, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN })


        await session.commitTransaction();

        session.endSession();

        await sendEmail(email, "Email Verification", otp);

        return res.status(201).
        json({success: "User created successfully and OTP sent to your email",
            userId : newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            token,
            isVerified: newUser.isVerified,
        })
        

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).
        json({
            message : error.message || "Something went wrong",
        })
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message : "Kindly provide your email or username and password",
            })
        }
        const user = await User.findOne({  email });
        if (!user) {
            return res.status(404).json({
                message : "User not found",
            })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message : "Invalid password",
            })
        }
        const token = jwt.sign( {userId: user._id}, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN })

        res.status(200).json({
            message : "User signed in successfully",
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user._id,
            email: user.email,
            isVerified: user.isVerified,
        })

    }catch (error) {
        res.status(500).
        json({
            message : error.message || "Something went wrong",
        })
    }
}

const signOut = async (req, res) => {
    return res.status(200).json({
        message: "User signed out successfully",
        prompt : "Remember to remove the token from local storage",
    });
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required to reset password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const resetLink = `https://requestaquote-auth.vercel.app/newPassword?token=${token}`;
    await sendEmail(
      email,
      "Password Reset",
      `Your password reset link is: <a href="${resetLink}">Click here to reset your password</a>
`
    );

    return res.status(200).json({ message: "Password reset link sent to your email" });

  } catch (error) {
    return res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;

    const { newPassword, confirmPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = await User.findOne({ _id: decoded.userId });

    if (!decoded || !userId) {
      return res.status(422).json({ message: "Invalid or expired token" });
    }
    
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne(
      { _id: userId._id },
      { $set: { password: hashedPassword } }
    );

    return res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

module.exports = { signUp, signIn, signOut, forgotPassword, resetPassword };