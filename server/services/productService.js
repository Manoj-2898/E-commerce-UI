import Product from '../models/Product.js';

export const queryProducts = (query, sortOptions, pagination) => {
  const { skip, limit } = pagination;
  return Product.find(query).sort(sortOptions).skip(skip).limit(limit);
};

export const countProducts = (query) => Product.countDocuments(query);

export const getProductById = (id) => Product.findById(id);

export const createProduct = (payload) => Product.create(payload);

export const updateProductById = (id, payload) =>
  Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

export const deleteProductById = (id) => Product.findByIdAndDelete(id);

export const getFeaturedProducts = () => Product.find({ featured: true }).limit(8);


