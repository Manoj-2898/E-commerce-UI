import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import Input from '../components/Input';
import AnimationWrapper from '../components/AnimationWrapper';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || '');

const CheckoutForm = ({ onSubmit, submitting }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ stripe, elements });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" className="w-full mt-4" disabled={!stripe || submitting}>
        {submitting ? 'Processing...' : 'Pay securely'}
      </Button>
    </form>
  );
};

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const stripeOptions = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: 'flat',
      },
    }),
    [clientSecret]
  );

  useEffect(() => {
    const createIntent = async () => {
      if (!import.meta.env.VITE_STRIPE_PK || cartTotal <= 0) return;
      try {
        const response = await api.post(API_ENDPOINTS.STRIPE.CREATE_INTENT, { amount: cartTotal });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.warn('Stripe not configured or unreachable, falling back to mock checkout');
      }
    };

    createIntent();
  }, [cartTotal]);

  const handlePlaceOrder = async ({ stripe, elements }) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!shipping.street || !shipping.city || !shipping.state || !shipping.zipCode || !shipping.country) {
      toast.error('Please complete the shipping address');
      return;
    }

    setLoading(true);
    try {
      if (stripe && elements && clientSecret) {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin + '/order-success',
          },
          redirect: 'if_required',
        });

        if (error) {
          throw new Error(error.message);
        }
      }

      await api.post(API_ENDPOINTS.ORDERS.CREATE, {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: shipping,
        paymentMethod: 'stripe',
        itemsPrice: cartTotal,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: cartTotal,
      });

      clearCart();
      navigate('/order-success', { state: { total: cartTotal } });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Add items to cart to checkout.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AnimationWrapper>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Street"
                  value={shipping.street}
                  onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                  required
                />
                <Input
                  label="City"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  required
                />
                <Input
                  label="State"
                  value={shipping.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  required
                />
                <Input
                  label="ZIP Code"
                  value={shipping.zipCode}
                  onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                  required
                />
                <Input
                  label="Country"
                  value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  required
                />
              </div>
            </div>

            {clientSecret ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <CheckoutForm onSubmit={handlePlaceOrder} submitting={loading} />
                </Elements>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-2">Payment</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Stripe test keys not detected. Proceeding will create the order without charging a card.
                </p>
                <Button className="mt-4" onClick={() => handlePlaceOrder({})} disabled={loading}>
                  {loading ? 'Placing order...' : 'Place Order'}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default Checkout;


