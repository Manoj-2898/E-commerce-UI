export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  PRODUCTS: {
    ALL: '/products',
    FEATURED: '/products/featured',
    BY_ID: (id) => `/products/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    MY_ORDERS: '/orders/myorders',
    BY_ID: (id) => `/orders/${id}`,
    PAY: (id) => `/orders/${id}/pay`,
    ALL: '/orders',
  },
  USERS: {
    PROFILE: '/users/profile',
    ALL: '/users',
  },
  STRIPE: {
    CREATE_INTENT: '/stripe/create-payment-intent',
  },
};

export const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Other'];

export const SORT_OPTIONS = [
  { value: 'createdAt', order: 'desc', label: 'Newest' },
  { value: 'price', order: 'asc', label: 'Price: Low to High' },
  { value: 'price', order: 'desc', label: 'Price: High to Low' },
  { value: 'name', order: 'asc', label: 'Name: A-Z' },
];

