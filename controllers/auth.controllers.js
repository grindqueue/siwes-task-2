const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const User = require("../models/models.users");

const sendEmail = require("../middlewares/nodemailer.middleware");



const signUp = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log(req.body)
        const { firstName, lastName, userName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        const existingUserName = await User.findOne({ userName });
        if (existingUser) {
            throw new Error("Email address is already linked to an account");
        }
        if (existingUserName) {
            throw new Error("Username already exist, enter another username");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [ newUser ] = await User.create([{ firstName, lastName, userName, email, password: hashedPassword }], { session })

        const token = jwt.sign( {userId: newUser._id}, JWT_SECRET, {expiresIn : JWT_EXPIRES_IN })


        await session.commitTransaction();

        session.endSession();

        res.status(201).
        send("User created successfully");
        sendEmail(email, "Email Verification", `Your verification code is `);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).
        json({
            message : error.message || "Something went wrong",
        })
    }
}

const signIn = async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        if ((!email && !userName) || !password) {
            return res.status(400).json({
                message : "Kindly provide your email or username and password",
            })
        }
        const user = await User.findOne({ $or: [ { email }, { userName } ] });
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
            userName : user.userName,
        })
    }catch (error) {
        res.status(500).
        json({
            message : error.message || "Something went wrong",
        })
    }
}
const signOut = async (req, res) => {
    res.status(200).json({
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
    await sendEmail(email, "Password Reset", `Your password reset link is: http://example.com/reset-password/${user._id}`);

    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    } 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

module.exports = { signUp, signIn, signOut, forgotPassword };