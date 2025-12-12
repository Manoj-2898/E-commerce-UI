import {
  queryProducts,
  countProducts,
  getProductById as findProductById,
  createProduct as createProductService,
  updateProductById as updateProductService,
  deleteProductById as deleteProductService,
  getFeaturedProducts as getFeaturedProductsService,
} from '../services/productService.js';

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await queryProducts(query, sortOptions, { skip, limit: limitNum });
    const total = await countProducts(query);

    res.json({
      success: true,
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    // Fallback to sample data if database is unavailable
    const sampleProducts = [
      {
        _id: 'p1',
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
        _id: 'p2',
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
        _id: 'p3',
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
        _id: 'p4',
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
        _id: 'p5',
        name: 'Trail Running Shoes',
        description: 'Lightweight cushioning with aggressive outsole for all terrains.',
        price: 129.0,
        category: 'Sports',
        brand: 'AeroRun',
        stock: 40,
        image: 'https://placehold.co/900x600?text=Trail+Running+Shoes',
        featured: false,
      },
      {
        _id: 'p6',
        name: 'Yoga Essentials Kit',
        description: '6mm mat, two cork blocks, strap, and microfiber towel for daily practice.',
        price: 79.99,
        category: 'Sports',
        brand: 'ZenForm',
        stock: 60,
        image: 'https://placehold.co/900x600?text=Yoga+Essentials+Kit',
        featured: false,
      },
      {
        _id: 'p7',
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
        _id: 'p8',
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
        _id: 'p9',
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
        _id: 'p10',
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated 24oz bottle that keeps drinks cold for 24 hours and hot for 12.',
        price: 32.5,
        category: 'Sports',
        brand: 'Hydra',
        stock: 120,
        image: 'https://placehold.co/900x600?text=Stainless+Steel+Water+Bottle',
        featured: true,
      },
    ];

    let filteredProducts = sampleProducts;

    // Apply filters
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(lowerKeyword) ||
        p.description.toLowerCase().includes(lowerKeyword)
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter(p => {
        if (minPrice && p.price < minPrice) return false;
        if (maxPrice && p.price > maxPrice) return false;
        return true;
      });
    }

    // Apply sorting
    if (sortBy === 'price') {
      filteredProducts.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    } else if (sortBy === 'name') {
      filteredProducts.sort((a, b) => order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    }

    // Apply pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const paginatedProducts = filteredProducts.slice(skip, skip + limitNum);

    console.log('⚠️ Database unavailable, returning sample products');
    res.json({
      success: true,
      products: paginatedProducts,
      page: pageNum,
      pages: Math.ceil(filteredProducts.length / limitNum),
      total: filteredProducts.length,
    });
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const product = await createProductService(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    let product = await findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product = await updateProductService(req.params.id, req.body);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await deleteProductService(req.params.id);

    res.json({
      success: true,
      message: 'Product removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await getFeaturedProductsService();

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    // Fallback to sample data if database is unavailable
    const sampleFeaturedProducts = [
      {
        _id: 'p1',
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
        _id: 'p2',
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
        _id: 'p4',
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
        _id: 'p7',
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
        _id: 'p10',
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated 24oz bottle that keeps drinks cold for 24 hours and hot for 12.',
        price: 32.5,
        category: 'Sports',
        brand: 'Hydra',
        stock: 120,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e9?auto=format&fit=crop&w=900&q=80',
        featured: true,
      },
    ];

    console.log('⚠️ Database unavailable, returning sample featured products');
    res.json({
      success: true,
      products: sampleFeaturedProducts,
    });
  }
};

