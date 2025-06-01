const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
require('dotenv').config();



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
};

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from : process.env.EMAIL_ACCOUNT,
            to: to,
            subject: subject,
            text: text,
        })
        console.log(to, subject, text);
    }catch (error) {
        console.error('Error sending email:', error.message);
    }
}

module.exports = {sendEmail, generateOTP};