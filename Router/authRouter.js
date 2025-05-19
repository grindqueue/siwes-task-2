const express = require("express");
const { signUp, signIn, signOut, forgotPassword } = require("../controllers/auth.controllers");
const authorize = require("../middlewares/auth.middlewares");

const authRouter = express.Router();


authRouter.post("/signup", (req, res) => {
    
    signUp(req,res);
})
authRouter.post("/signin", (req, res) => {
    signIn(req,res);
})
authRouter.post("/forgetpassword", authorize, (req, res) => {
    forgotPassword(req,res);
})
authRouter.post("/signout",signOut);


module.exports = authRouter;