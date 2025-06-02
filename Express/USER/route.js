import express from 'express';
import { userlogin, usersignup, createUser, updateUser, deleteUser } from './controller.js';

const router = express.Router();

// Login and Signup routes
router.get('/login', userlogin);
router.get('/signup', usersignup);

// POST - Create user
router.post('/create', createUser);

// PUT - Update user
router.put('/update/:id', updateUser);

// DELETE - Delete user
router.delete('/delete/:id', deleteUser);

export default router;
