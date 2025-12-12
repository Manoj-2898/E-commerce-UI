import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Button from './Button';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);

  const placeholderImage = `https://via.placeholder.com/400x320?text=${encodeURIComponent(product.name)}`;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={imageError ? placeholderImage : product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
          />
          {product.featured && (
            <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ${product.price.toFixed(2)}
          </span>
          {product.stock > 0 ? (
            <span className="text-sm text-green-600 dark:text-green-400">
              In Stock
            </span>
          ) : (
            <span className="text-sm text-red-600 dark:text-red-400">
              Out of Stock
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            <FiShoppingCart className="inline mr-1" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3"
            onClick={() => addToWishlist(product)}
          >
            <FiHeart />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

