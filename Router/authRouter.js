const express = require("express");
const { signUp, signIn, signOut, forgotPassword,resetPassword } = require("../controllers/auth.controllers");
const verifyOTP = require("../middlewares/verifyotp");
const { resendOTP } = require("../middlewares/resendotp");
const authRouter = express.Router();


authRouter.post("/signup", async(req, res) => {  
    await signUp(req,res);
})
authRouter.post("/signin", (req, res) => {
    signIn(req,res);
})
authRouter.post("/forgotpassword", forgotPassword);
authRouter.post("/signout",signOut);
authRouter.post('/signup/verifyotp', async (req, res) => {
    verifyOTP(req, res);
})
authRouter.post('/signup/resendotp', async (req, res) => {
    resendOTP(req, res);
});
authRouter.post('/reset-password/:token', resetPassword);
module.exports = authRouter;