import express from 'express';
import {
  getUsers,
  getUserById,
  updateProfile,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.put('/profile', protect, updateProfile);
router.get('/:id', protect, admin, getUserById);
router.delete('/:id', protect, admin, deleteUser);

export default router;

