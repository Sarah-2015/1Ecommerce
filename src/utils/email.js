import nodemailer from "nodemailer";

export const sendMail = async({email,subject,html,attachments = []}= {}) => {

    let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.gmail, // generated ethereal user
        pass: process.env.gmailPass, // generated ethereal password
    },
});

    // send mail with defined transport object
    
    let info = await transporter.sendMail({
      from: `"Sarah 👻" <${process.env.email}>`, // sender address
      to: email, // list of receivers
      subject, // Subject line
      html, // html body
      attachments
    });
  
    return info.rejected.length ? false : true
  
  }
  export default sendMail