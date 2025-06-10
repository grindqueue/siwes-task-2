const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { Schema } = mongoose;

const requestaQuoteSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name : {
        type : String,
        required : true,
        minlength : [2, "name should not be shorter than 2 characters"],
        maxlength : [100, "name should not exceed 100 characters"]
    },
    phoneNumber : {
        type:String,
        required:[true,"Kindly enter your phone number"],
        match: [/^\+?\d{10,15}$/, "Please enter a valid phone number"]
    },
    email : {
        type:String,
        required:[true,"Please enter your email address"],
        unique: [true, "Email already used to register"],
        match: [/.+@.+\..+/, "Please enter a valid email address"],
        trim : true,
        lowercase: true,
    },
    projectType : {
        type:String,
        trim : true,
    },
    estimatedBudget : {
        type : Number,
        required : true
    },
    maximumTime : {
        type : String,
        required : true,
    },
    companyName : {
        type : String,
        required : true,
        trim : true,
    },
    requiredSkills : {
        type : String,
        trim : true,
        Enum : ["IT Management Services", "Cyber Security Services", "Cloud Computing Services", "IT Consulting Services", "Software Dev Services"]
    },
    country : {
        type: String,
        required : true,
        trim : true,
    }
})

const RequestaQuote = mongoose.model("RequestaQuote", requestaQuoteSchema);

module.exports = RequestaQuote;