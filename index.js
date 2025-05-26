const express = require("express");

require('dotenv').config();
const cookieParser = require("cookie-parser");
const authRouter = require("./Router/authRouter"); // auth router route
const userRouter = require("./Router/userRouter");// user router route
const requestaQuoteRouter = require("./Router/requestaQuoteRouter");
const connectDatabase = require("./database/mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require(helmet);

app.use(helmet());


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());


app.use("/auth", authRouter);
app.use(userRouter);
app.use( requestaQuoteRouter);

app.listen(process.env.PORT, async() => {
    console.log(`Server running at port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT}`);
    await connectDatabase();
});


app.use((req, res, error) => {
    res.status(404).json({
        message: "ERROR 404: Not Found",
    });
})