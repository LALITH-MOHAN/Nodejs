import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  getUsers,
  getUserByEmail,
  addUser,
  deleteUser as deleteUserModel
} from '../model/userModel.js';

import logger from '../utils/logger.js';

export const listUsers = async (req, res) => {
  try {
    const users = await getUsers();
    logger.info('Fetched users list');
    res.json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      logger.warn(`Attempt to register with existing email: ${email}`);
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await addUser(name, email, hashedPassword);
    logger.info(`New user registered: ${email}`);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      logger.warn(`Login failed: user not found - ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.warn(`Login failed: incorrect password - ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    logger.info(`User logged in: ${email}`);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUserModel(id);
    logger.info(`User deleted with ID: ${id}`);
    res.status(204).end();
  } catch (error) {
    logger.error(`Failed to delete user with ID ${id}: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
