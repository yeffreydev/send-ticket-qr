const express = require("express");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const htmlEmail = require("./html-email");
const dotenv = require("dotenv");
const { sendEmail } = require("./utils");
const { logToFile } = require("./logger");
dotenv.config();

const app = express();
app.use(express.static("public"));

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 👇 importante: NO usar express.json() globalmente para el webhook
// solo usar raw en /webhook
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint webhook
app.post("/webhook", bodyParser.raw({ type: "application/json" }), (req, res) => {
  try {
    let event;

    if (endpointSecret) {
      const signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
      } catch (err) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    } else {
      event = JSON.parse(req.body);
    }
    logToFile(event)
    console.log(event);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        const session = event.data.object;

        console.log("✅ Session:", session);
        console.log("📌 Customer:", session.customer_details);

        const customerEmail = session.customer_details.email;
        const randomTicketNumber = Math.floor(100000 + Math.random() * 900000);
        const nombres = session.customer_details.name;

        try {
          sendEmail({
            to: customerEmail,
            subject: "Ticket de acceso",
            html: htmlEmail(randomTicketNumber, nombres),
            nombres,
            nro: randomTicketNumber,
          });
          console.log("📧 Email enviado a:", customerEmail);
        } catch (error) {
          console.error("❌ Error enviando email:", error);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logToFile(error);
    console.error("❌ Error en el endpoint /webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// iniciar server
app.listen(process.env.PORT, () => {
  console.log(
    `🚀 Webhook server corriendo en http://localhost:${process.env.PORT}`
  );
});
