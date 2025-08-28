const nodemailer = require("nodemailer");
const generarQR = require("./qr-generator");

async function sendEmail(options) {
    const qr = await generarQR(options.nombres, options.nro);
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = await getEmailTransporter();
      const { to, subject, html } = options;
      const from = `PRUEBA <${process.env.SEND_EMAIL_FROM}>`;
      const message = { to, subject, html, from ,attachments: [
        {
          filename: "white-logo.png",
          path: "./white-logo.png",
          cid: "logo" 
        },
        {
            filename: "qr.png",
            content: qr,
            cid: "qr" 
        },
        {
            filename: "bg.jpeg",
            path: "./bg.jpeg",
            cid: "bg" 
        }
      ]};
      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log("Message sent:", info.messageId);
        resolve(info);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function getEmailTransporter() {
  return new Promise((resolve, reject) => {
    if (!process.env.RESEND_API_KEY) {
      return reject(new Error("Missing Resend configuration"));
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      secure: true,
      port: 465,
      auth: { user: "resend", pass: process.env.RESEND_API_KEY },
    });
    resolve(transporter);
  });
}

module.exports = {
  sendEmail,
};