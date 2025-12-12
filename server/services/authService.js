import User from '../models/User.js';

export const findUserByEmail = (email) => User.findOne({ email });

export const findUserWithPassword = (email) => User.findOne({ email }).select('+password');

export const createUser = (payload) => User.create(payload);

export const findUserById = (id) => User.findById(id);


