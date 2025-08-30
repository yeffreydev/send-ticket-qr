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

// ⚠️ No usar express.json() globalmente
app.use(bodyParser.urlencoded({ extended: true }));

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // fuerza a usar versión estable
});

// Endpoint webhook
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    let event;

    try {
      // ⚠️ Guardar el raw body como string para debug
      const rawBody = req.body.toString("utf8");
      logToFile(`Raw body recibido: ${rawBody}`);

      if (endpointSecret) {
        const signature = req.headers["stripe-signature"];
        try {
          event = stripe.webhooks.constructEvent(
            req.body, // buffer
            signature,
            endpointSecret
          );
        } catch (err) {
          console.error("⚠️ Verificación de firma fallida:", err.message);
          logToFile(`Error firma: ${err.message}`);
          return res.sendStatus(400);
        }
      } else {
        // si no tienes endpointSecret, parsea normal
        event = JSON.parse(rawBody);
      }

      logToFile(`Evento Stripe recibido: ${JSON.stringify(event, null, 2)}`);

      // Manejo de eventos
      switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded":
          const session = event.data.object;

          const customerEmail = session.customer_details.email;
          const randomTicketNumber = Math.floor(
            100000 + Math.random() * 900000
          );
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
            logToFile(`Error enviando email: ${error.message}`);
          }
          break;

        default:
          console.log(`⚠️ Evento no manejado: ${event.type}`);
          logToFile(`Evento no manejado: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("❌ Error en webhook:", error);
      logToFile(`Error en webhook: ${error.stack}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// iniciar server
app.listen(process.env.PORT, () => {
  console.log(
    `🚀 Webhook server corriendo en http://localhost:${process.env.PORT}`
  );
});
