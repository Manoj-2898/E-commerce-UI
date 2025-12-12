import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Create Stripe payment intent
 * @route   POST /api/stripe/create-payment-intent
 * @access  Private
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // Amount should be in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

