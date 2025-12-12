import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import DarkModeToggle from './DarkModeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FiShoppingCart className="text-primary-600 dark:text-primary-400 text-2xl" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              E-Commerce
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Products
            </Link>
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Wishlist
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FiUser size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <FiLogOut size={24} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300"
            >
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/products"
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/wishlist"
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/profile"
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 dark:text-red-400"
                >
                  Logout
                </button>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/login"
                    className="block text-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

