import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { getModuleLogger } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'Nikithaa123';
const logger = getModuleLogger('user');

// Model functions
const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async (userData) => {
  const { name, email, password, role = 'customer' } = userData;
  const user = await User.create({ name, email, password, role });
  return user.id;
};

const findUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'role']
  });
};

const checkEmailExists = async (email) => {
  const user = await User.findOne({ 
    where: { email },
    attributes: ['id']
  });
  return !!user;
};

// Service functions
export const registerUser = async ({ name, email, password }) => {
  logger.info(`Registering user with email: ${email}`);
  
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    logger.warn(`Email already exists: ${email}`);
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await createUser({
    name,
    email,
    password: hashedPassword,
    role: 'customer'
  });

  const token = jwt.sign({ id: userId, role: 'customer' }, JWT_SECRET, {
    expiresIn: '1d'
  });

  logger.info(`User registered successfully: ${email} (ID: ${userId})`);

  return {
    message: 'User registered successfully',
    token,
    user: { id: userId, name, email, role: 'customer' }
  };
};

export const loginUser = async ({ email, password }) => {
  logger.info(`Login attempt for email: ${email}`);

  const user = await findUserByEmail(email);
  if (!user) {
    logger.warn(`Login failed - user not found: ${email}`);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn(`Login failed - incorrect password for email: ${email}`);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '1d'
  });

  const { password: _, ...userData } = user;

  logger.info(`User logged in successfully: ${email} (ID: ${user.id})`);

  return {
    message: 'Login successful',
    token,
    user: userData
  };
};

export const getCurrentUserProfile = async (userId) => {
  logger.info(`Fetching profile for user ID: ${userId}`);

  const user = await findUserById(userId);
  if (!user) {
    logger.error(`User not found with ID: ${userId}`);
    throw new Error('User not found');
  }

  logger.debug(`User profile fetched: ${JSON.stringify(user)}`);
  return user;
};
