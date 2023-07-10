const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User')

function generateToken(email, expiresIn) {
    const header = { alg: 'HS256' };
    const secretKey = process.env.JWT_SECRET; 
    const token = jwt.sign({ email }, secretKey,{ header }, { expiresIn });
    return token;
 }

 const sendResetToken = (email) => {
    let tokenData = generateToken(email,process.env.JWT_LIFETIME)
    let tokenuser = User.findOne({email})
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user:process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    })
    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'password reset',
        text: `pls copy this token and use to reset your password ${tokenData}`
    }

   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    console.log('Error sending email:', error);
    } else {
    console.log('Email sent:', info.response);
    
    }
});
return tokenData
}

module.exports = {sendResetToken}