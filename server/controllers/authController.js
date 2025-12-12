import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserWithPassword,
} from '../services/authService.js';

// Fallback mock users store when MongoDB is unavailable
import * as mockUsers from '../config/mockUsers.js';

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user exists and create user.
    // Use DB if available; otherwise fallback to mock store.
    let user;
    try {
      const userExists = await findUserByEmail(email);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        });
      }

      user = await createUser({ name, email, password });
    } catch (dbErr) {
      // If DB is down, use mock store
      if (dbErr.message && /connect|ECONNREFUSED|timed out|failed/i.test(dbErr.message)) {
        const existing = await mockUsers.findByEmail(email);
        if (existing) {
          return res.status(400).json({ success: false, message: 'User already exists' });
        }
        user = await mockUsers.createUser({ name, email, password });
        // normalize fields to match DB user shape
        user._id = user.id;
      } else {
        throw dbErr;
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Try DB lookup first, fallback to mock store if DB is unavailable
    let user;
    try {
      user = await findUserWithPassword(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Check password using model method
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (dbErr) {
      // DB error - use mock store
      if (dbErr.message && /connect|ECONNREFUSED|timed out|failed/i.test(dbErr.message)) {
        const mock = await mockUsers.findWithPassword(email);
        if (!mock) {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, mock.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        user = mock;
        user._id = user.id;
      } else {
        throw dbErr;
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

