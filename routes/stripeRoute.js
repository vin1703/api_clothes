const router = require("express").Router();
const dotenv = require('dotenv');
dotenv.config();
const KEY = process.env.STRIPE_KEY
const stripe = require("stripe")(KEY);

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
            unit_amount: req.body.amount, 
          },
          quantity: 1,
        },
      ],
      billing_address_collection: 'required',
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during payment processing' });
  }
});

module.exports = router;
