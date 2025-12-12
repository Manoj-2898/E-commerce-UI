import Product from '../models/Product.js';

const sampleProducts = [
  {
    name: 'Noise-Cancelling Headphones',
    description: 'Wireless over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    category: 'Electronics',
    brand: 'SoundWave',
    stock: 32,
    image: 'https://images.unsplash.com/photo-1515202913167-d9a698095ebf?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your workouts, heart rate, and sleep with a bright AMOLED display.',
    price: 149.5,
    category: 'Electronics',
    brand: 'Pulse',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    name: 'Minimalist Sofa',
    description: 'Modern 3-seater fabric sofa with oak legs and stain-resistant coating.',
    price: 899.0,
    category: 'Home & Garden',
    brand: 'Nordic',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
    featured: false,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Breathable mesh back, adjustable lumbar support, and smooth-rolling wheels.',
    price: 259.99,
    category: 'Home & Garden',
    brand: 'FlowSeat',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    name: 'Trail Running Shoes',
    description: 'Lightweight cushioning with aggressive outsole for all terrains.',
    price: 129.0,
    category: 'Sports',
    brand: 'AeroRun',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    featured: false,
  },
  {
    name: 'Yoga Essentials Kit',
    description: '6mm mat, two cork blocks, strap, and microfiber towel for daily practice.',
    price: 79.99,
    category: 'Sports',
    brand: 'ZenForm',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    featured: false,
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless medium-wash denim with soft cotton lining for year-round wear.',
    price: 89.99,
    category: 'Clothing',
    brand: 'Everline',
    stock: 70,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    name: 'Organic Cotton Hoodie',
    description: 'Super-soft fleece hoodie with relaxed fit and kangaroo pocket.',
    price: 64.0,
    category: 'Clothing',
    brand: 'PureWear',
    stock: 55,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    featured: false,
  },
  {
    name: 'Hardcover Notebook Set',
    description: 'Set of 3 dotted notebooks with lay-flat binding and premium paper.',
    price: 28.99,
    category: 'Other',
    brand: 'Scripted',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    featured: false,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated 24oz bottle that keeps drinks cold for 24 hours and hot for 12.',
    price: 32.5,
    category: 'Sports',
    brand: 'Hydra',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e9?auto=format&fit=crop&w=900&q=80',
    featured: true,
  }
];

export const seedDatabase = async () => {
  try {
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      console.log('Seeding database with sample products...');
      await Product.insertMany(sampleProducts);
      console.log('✅ Sample products inserted successfully');
    } else {
      console.log(`ℹ️  Database already contains ${existingProducts} products. Skipping seed.`);
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};
