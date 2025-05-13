const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { Schema } = mongoose;

const signUpSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    firstName : {
        type : String,
        required : [true, "firstname field is required"],
        minlength : 2,
        trim : true,
    },
    lastName: {
        type : String,
        trim : true,
        minLength : 2,
        required: [true, "lastname field is required"],
    },
    userName :{
        type:String,
        required: [true,'Please enter your username'],
        minlength : [6, "User name can not be less than six characters"],
        maxLength : [100,"Username should not exceed 100 characters"],
        trim : true,
    },
    email : {
        type:String,
        required:[true,"Please enter your email address"],
        unique: [true, "Email already used to register"],
        match: [/.+@.+\..+/, "Please enter a valid email address"],
        trim : true,
        lowercase: true,
    },
    password : {
        type : String,
        required:[true,"Kindly enter your password"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
            "Password must have at least 8 characters, including uppercase, lowercase, number, and a symbol"
        ],
    },
    // isVerified : {
    //     type : Boolean,
    //     default : false,
    // },
},{
    timestamps : true
});

module.exports = mongoose.model("User", signUpSchema);