const htmlEmail = require("./html-email");
const { sendEmail } = require("./utils");
const dotenv = require("dotenv");

dotenv.config();

const randomTicketNumber = Math.floor(100000 + Math.random() * 900000);
const nombres = "Juan Pérez";
sendEmail({
    to: "yeffrey4008@gmail.com",
    subject: "Prueba",
    html: htmlEmail(randomTicketNumber, nombres),
    nombres,
    nro: randomTicketNumber
});