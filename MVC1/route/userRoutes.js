import express from 'express';
import {
  listUsers,
  createUser,
  editUser,
  removeUser
} from '../controller/userController.js';

const router = express.Router();

router.get('/users', listUsers);
router.post('/users', createUser);
router.put('/users/:id', editUser);
router.delete('/users/:id', removeUser);

export default router;
