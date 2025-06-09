import express from 'express';
import { 
  listUsers, 
  register, 
  login, 
  deleteUser 
} from '../controller/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', authenticate, listUsers);
router.post('/register', register);
router.post('/login', login);
router.delete('/users/:id', authenticate, deleteUser);

export default router;