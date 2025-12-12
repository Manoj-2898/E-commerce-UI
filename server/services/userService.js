import User from '../models/User.js';

export const fetchUsers = () => User.find({}).select('-password');

export const fetchUserById = (id) => User.findById(id).select('-password');

export const updateUserById = (id, payload) =>
  User.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).select('-password');

export const deleteUserById = (id) => User.findByIdAndDelete(id);


