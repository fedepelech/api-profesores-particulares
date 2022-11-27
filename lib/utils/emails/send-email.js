'use strict';
const nodemailer = require('nodemailer');
let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    service: 'gmail',
    port: 465,
    auth: {
        user: process.env.SEND_EMAIL_AUTH_USER,
        pass: process.env.SEND_EMAIL_AUTH_PASS
    }
});

function sendEmail(to, subject, html) {
    console.log(process.env.SEND_EMAIL_AUTH_USER, process.env.SEND_EMAIL_AUTH_PASS);
    const message = {
        from: process.env.SEND_EMAIL_AUTH_USER,
        to,
        subject,
        html
    };
    return transport.sendMail(message);
}

module.exports = sendEmail;