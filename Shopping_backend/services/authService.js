import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'Nikithaa123';

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
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
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

  return {
    message: 'User registered successfully',
    token,
    user: { id: userId, name, email, role: 'customer' }
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '1d'
  });

  const { password: _, ...userData } = user;

  return {
    message: 'Login successful',
    token,
    user: userData
  };
};

export const getCurrentUserProfile = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};