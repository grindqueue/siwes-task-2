const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { Schema } = mongoose;

const requestaQuoteSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    firstName : {
        type : String,
        required : true,
        minlength : [2, "First name should not be shorter than 2 characters"],
        maxlength : [16, "First name should not exceed 25 characters"]
    },
    lastName : {
        type : String,
        required : true,
        minlength : [2, "First name should not be shorter than 2 characters"],
        maxlength : [16, "First name should not exceed 25 characters"]
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
    },
    message : {
        type: String,
        required : true,
        maxlength : [500, "Message must not exceed 500 characters"],
        trim : true,
    }
})