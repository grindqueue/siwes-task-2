const mongoose = require("mongoose");

require("dotenv").config();

const dbURI = process.env.MONGO_URI;

const connectDatabase = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log("Database connected")
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectDatabase;