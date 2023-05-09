const nodemailer = require('nodemailer')

require('dotenv').config({path:"../config/.env"});
// console.log(process.env.JWT_secretKey);
// console.log(process.env.JWT_expire);
// console.log(process.env.SMPT_PASSWORD);
// console.log(process.env.SMPT_MAIL);
// console.log(process.env.SMPT_SERVICE);


const sendEmail = async (options)=>{

    // const transporter = nodemailer.createTransport({
    //     service:process.env.SMPT_SERVICE,
    //     auth:{
    //         user:process.env.SMPT_MAIL,
    //         pass:process.env.SMPT_PASSWORD,
    //     }
    // })

    // const mailOptions = {
    //     from:process.env.SMPT_MAIL,
    //     to:options.email,
    //     subject:options.subject,
    //     text:options.message,
    // };

    const transpoter = nodemailer.createTransport({
        // na chale to 
        host:"smtp.gmail.com",
        port:465,
        service:'gmail',
        auth:{
            user:'21bcs180@iiitdmj.ac.in',
            pass: "wnzclvsznzkrpjfj"
        }
    })

    const mailOptions = {
        from: "21bcs180@iiitdmj.ac.in",
        to: options.email,
        cc: "jaiswalmanju31@gmail.com,sadanandmanshokjaiswal@gmail.com",
        // cc: "21bcs138@iiitdmj.ac.in,21bcs116@iiitdmj.ac.in,21bcs123@iiitdmj.ac.in",
        // cc: "21bcs138@iiitdmj.ac.in,sadanandjaiswal92@gmail.com",
        bcc: "jaiswalsadanand721@gmail.com",
        subject: options.subject,
        text: options.message,
    }
    transpoter.sendMail(mailOptions);
}

module.exports = sendEmail;