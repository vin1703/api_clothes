

const router = require("express").Router();
const stripe = require("stripe")("sk_test_51P1l2eSHixY5uWObT9uOfeR541vZrYVdN2N45tCVRIl5ABM1FlRNFMl5FxkwnI3kfFf6VqenulG5qAlvvnV5rIOn00ppEP5tKi"
);

router.post("/payment", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt', // Change this to your product name
            },
            unit_amount: req.body.amount, // Make sure this is in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success', // Change this to your success URL
      cancel_url: 'http://localhost:3000/cancel', // Change this to your cancel URL
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during payment processing' });
  }
});


module.exports = router;
