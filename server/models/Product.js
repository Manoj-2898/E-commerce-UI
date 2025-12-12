import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Other'],
    },
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;

