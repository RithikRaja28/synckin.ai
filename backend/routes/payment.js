const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");
const moment = require("moment");
const authmiddleware = require("../middleware/authmiddleware");
require("dotenv").config();

router.post("/create-checkout-session", authmiddleware, async (req, res) => {
  const { price } = req.body;
  const userId = req.user?.id;

  if (!price || isNaN(price)) {
    return res.status(400).json({ error: "Invalid price" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Subscription Plan",
            },
            unit_amount: price * 100, // Price in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/dashboard",
    });

    console.log("Session created:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/payment-success", authmiddleware, async (req, res) => {
  const session_id = req.body.session_id; // Get session_id from the body instead of query parameters
  const userId = req.user?.id; // Ensure you are getting userId correctly

  if (!session_id) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Retrieved session:", session);
    if (session && session.payment_status === "paid") {
      const startDate = new Date();
      const endDate = moment(startDate).add(1, "month").toDate(); // Add one month

      await User.findByIdAndUpdate(userId, {
        $set: {
          "subscription.status": true,
          "subscription.startDate": startDate,
          "subscription.endDate": endDate,
        },
      });

      res
        .status(200)
        .json({ message: "Payment successful and subscription updated" });
    } else {
      res.status(400).json({ message: "Payment failed or incomplete" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
