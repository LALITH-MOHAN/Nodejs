import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  createUser,
  findUserById,
  checkEmailExists
} from '../model/authModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'Nikithaa123';

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
