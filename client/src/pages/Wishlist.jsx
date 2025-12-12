import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import AnimationWrapper from '../components/AnimationWrapper';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <FiHeart className="text-primary-600 mb-4" size={48} />
        <h2 className="text-2xl font-semibold mb-2">Wishlist is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Save products to your wishlist and purchase them later.
        </p>
        <Link to="/products">
          <Button variant="primary">Shop Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AnimationWrapper>
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
                <p className="text-primary-600 dark:text-primary-400 font-semibold">${item.price.toFixed(2)}</p>
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(item._id);
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button variant="secondary" onClick={() => removeFromWishlist(item._id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default Wishlist;


