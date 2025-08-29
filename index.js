const express = require("express");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const htmlEmail = require("./html-email");
const dotenv = require("dotenv");
const { sendEmail } = require("./utils");
dotenv.config();

const app = express();
app.use(express.static("public"));

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//json
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// middleware para stripe (raw body, no JSON.parse normal)
app.use(
  bodyParser.raw({ type: "application/json" })
);

// endpoint webhook
app.post('/webhook', express.json({type: 'application/json'}), (req, res) => {
  let event = req.body;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
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
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

// iniciar server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Webhook server corriendo en http://localhost:${process.env.PORT}`);
});
