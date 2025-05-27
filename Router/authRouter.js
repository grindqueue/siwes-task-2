const express = require("express");
const { signUp, signIn, signOut, forgotPassword } = require("../controllers/auth.controllers");
const authorize = require("../middlewares/auth.middlewares");
const verifyOTP = require("../middlewares/verifyotp");
const { verify } = require("jsonwebtoken");
const authRouter = express.Router();


authRouter.post("/signup", async(req, res) => {  
    await signUp(req,res);
})
authRouter.post("/signin", (req, res) => {
    signIn(req,res);
})
authRouter.post("/forgetpassword", authorize, (req, res) => {
    forgotPassword(req,res);
})
authRouter.post("/signout",signOut);
authRouter.post('/signup/verifyotp', async (req, res) => {
    verifyOTP(req, res);
})


module.exports = authRouter;