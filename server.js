const express = require("express");

require('dotenv').config();
const cookieParser = require("cookie-parser");
const authRouter = require("./Router/authRouter");
const { userRouter } = require("./Router/UserRouter");
const requestaQuoteRouter = require("./Router/requestaQuoteRouter");
const connectDatabase = require("./database/mongodb");
const bodyParser = require("body-parser");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(bodyParser.json());


app.use("/auth", authRouter);
app.use(userRouter);
app.use("/requestaquote", requestaQuoteRouter);
const PORT = process.env.PORT;

app.listen(PORT, async() => {
    console.log(`Server running at port ${PORT}`);
    await connectDatabase();
});
app.get("/", (req, res) => {
    res.send("App running");
})