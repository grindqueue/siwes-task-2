const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();
const NODE_EMAILER_HOST = process.env.NODE_EMAILER_HOST;
const NODE_EMAILER_PORT = process.env.NODE_EMAILER_PORT;
const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const verificationCode = Math.floor(100000 + Math.random() * 900000);

const transporter = nodemailer.createTransport({
    secure: true,
    host: NODE_EMAILER_HOST,
    port: NODE_EMAILER_PORT,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        transporter.sendMail({
            to: User.email,
            subject: "Your email verification code",
            text: `Your verification code is ${verificationCode}`,
        })

    }catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    sendEmail,
    verificationCode
};