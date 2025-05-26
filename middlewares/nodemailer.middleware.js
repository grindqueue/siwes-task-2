const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
require('dotenv').config();
const NODE_EMAILER_HOST = process.env.NODE_EMAILER_HOST;
const NODE_EMAILER_PORT = process.env.NODE_EMAILER_PORT;
const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;




const transporter = nodemailer.createTransport({
    secure: true,
    service: 'gmail',
    auth: {
        user: EMAIL_ACCOUNT,
        pass: EMAIL_PASSWORD,
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
            from : EMAIL_ACCOUNT,
            to: to,
            subject: subject,
            text: text,
        })
        console.log(to, subject, text);
    }catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {sendEmail, generateOTP};