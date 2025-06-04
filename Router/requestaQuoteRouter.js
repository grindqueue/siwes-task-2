const express = require("express");
const authorize = require("../middlewares/auth.middlewares");
const {createRequestaQuote,  getAllRequestaQuote, getaUserQuote} = require("../controllers/requestaquote.controller");

const requestaQuoteRouter = express.Router();

requestaQuoteRouter.get("/user", authorize, (req, res) => getAllRequestaQuote(req, res));

requestaQuoteRouter.get("user/:id", authorize, (req, res) => getaUserQuote(req, res));

requestaQuoteRouter.post("/requestaquote", authorize, (req, res) => {
    createRequestaQuote(req, res);
});

module.exports = requestaQuoteRouter;