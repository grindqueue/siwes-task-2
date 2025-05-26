const express = require("express");

require('dotenv').config();
const cookieParser = require("cookie-parser");
const authRouter = require("./Router/authRouter");
const { userRouter } = require("./Router/UserRouter");
const requestaQuoteRouter = require("./Router/requestaQuoteRouter");
const connectDatabase = require("./database/mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors);

app.listen(process.env.PORT, async() => {
    console.log(`Server running at port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT}`);
    await connectDatabase();
});

app.use("/auth", authRouter);
app.use(userRouter);
app.use( requestaQuoteRouter);
const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("App running say hi");
})