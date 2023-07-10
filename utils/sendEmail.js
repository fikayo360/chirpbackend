const nodemailer = require('nodemailer')

const sendEmailConfirmation = (receiver) => {
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
        to: receiver,
        subject: 'welcome',
        text: `Welcome to chirp, the home of free and unfiltered news on the Go`
    }

   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    console.log('Error sending email:', error);
    } else {
    console.log('Email sent:', info.response);
    
    }
});
}

module.exports = {sendEmailConfirmation}