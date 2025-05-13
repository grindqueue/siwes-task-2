const express = require("express");
const authorize = require("../middlewares/auth.middlewares");
const { getAllUsers, getUser } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.get("/users", (req, res) => getAllUsers(req, res));

userRouter.get("/:id", authorize, (req, res) => getUser(req, res));


module.exports = {userRouter};