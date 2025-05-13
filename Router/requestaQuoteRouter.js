const express = require("express");
const authorize = require("../middlewares/auth.middlewares");
const {requestaQuoteController,  getAllRequestaQuote, getaUserQuote} = require("../controllers/requestaQuote.controller");

const requestaQuoteRouter = express.Router();

requestaQuoteRouter.get("/user", authorize, (req, res) => getAllRequestaQuote(req, res));

requestaQuoteRouter.get("user/:id", authorize, (req, res) => getaUserQuote(req, res));

requestaQuoteRouter.post("/requestaquote", authorize, (req, res) => {
    requestaQuoteController(req, res);
});

module.exports = requestaQuoteRouter;