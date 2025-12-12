import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product) => {
    setItems((prev) => {
      if (prev.some((p) => p._id === product._id)) {
        toast('Already in wishlist', { icon: 'ℹ️' });
        return prev;
      }
      toast.success('Added to wishlist');
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setItems((prev) => prev.filter((p) => p._id !== id));
    toast.success('Removed from wishlist');
  };

  const clearWishlist = () => {
    setItems([]);
    localStorage.removeItem('wishlist');
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};


