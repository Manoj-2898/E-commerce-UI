import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import Input from '../components/Input';
import AnimationWrapper from '../components/AnimationWrapper';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <FiShoppingBag className="text-primary-600 mb-4" size={48} />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Explore products and add them to your cart.</p>
        <Link to="/products">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AnimationWrapper>
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-36 h-36 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-primary-600 dark:text-primary-400 font-semibold mt-2">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-600"
                      aria-label={`Remove ${item.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <Input
                      type="number"
                      min={1}
                      className="w-24"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-2">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-6 flex items-center justify-center gap-2" variant="primary" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
              <FiArrowRight />
            </Button>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default Cart;


