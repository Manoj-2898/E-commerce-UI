import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { sampleProducts } from '../data/seedData';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      setProduct(response.data.product);
    } catch (error) {
      const fallback = sampleProducts.find((p) => p._id === id);
      if (fallback) {
        setProduct(fallback);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.stock > 0 ? (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">
                      Out of Stock
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                  {product.description}
                </p>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Category: <span className="font-semibold">{product.category}</span>
                  </p>
                  {product.brand && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Brand: <span className="font-semibold">{product.brand}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={quantity >= product.stock}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <FiShoppingCart className="inline mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => addToWishlist(product)}>
                    <FiHeart />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;

