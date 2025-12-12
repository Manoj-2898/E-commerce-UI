import Order from '../models/Order.js';

export const createNewOrder = (payload) => Order.create(payload);

export const findOrderById = (id) => Order.findById(id).populate('user', 'name email');

export const findOrdersByUser = (userId) => Order.find({ user: userId }).sort({ createdAt: -1 });

export const findAllOrders = () =>
  Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });

export const saveOrder = (order) => order.save();


