const express = require("express");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const htmlEmail = require("./html-email");
const dotenv = require("dotenv");
const { sendEmail } = require("./utils");
dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// middleware para stripe (raw body, no JSON.parse normal)
app.use(
  bodyParser.raw({ type: "application/json" })
);

// endpoint webhook
app.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Error verificando webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // procesar evento de pago exitoso
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log(session);
    console.log(event);
    console.log(event.data.object);
    console.log(event.data.object.customer_details);

    // email del usuario
    const customerEmail = session.customer_details.email;
    const randomTicketNumber = Math.floor(100000 + Math.random() * 900000);
    const nombres = session.customer_details.name;

   


    // enviar email
    try {
        sendEmail({
            to: customerEmail,
            subject: "Ticket de acceso",
            html: htmlEmail(randomTicketNumber, nombres),
            nombres,
            nro: randomTicketNumber
        });
      console.log("📧 Email enviado a:", customerEmail);
    } catch (error) {
      console.error("Error enviando email:", error);
    }
  }

  res.json({ received: true });
});

// iniciar server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Webhook server corriendo en http://localhost:${process.env.PORT}`);
});
