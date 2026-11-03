import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
} from '../controllers/userController.js';

const router = express.Router();

// User management endpoints
router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Roles list endpoint
router.get('/roles', getRoles);
router.get('/role-management', getRoles);

export default router;

