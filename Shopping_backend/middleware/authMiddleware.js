import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { getModuleLogger } from '../utils/logger.js';

const logger = getModuleLogger('user');

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      logger.warn('Authentication failed: No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role']
    });

    if (!user) {
      logger.warn(`Authentication failed: User not found for token ID ${decoded.id}`);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    logger.info(`Authenticated user: ${user.name} (ID: ${user.id})`);
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    logger.warn(`Unauthorized access attempt by user: ${req.user?.email} (Role: ${req.user?.role})`);
    return res.status(403).json({ message: 'Admin access required' });
  }

  logger.info(`Admin access granted: ${req.user.email}`);
  next();
};
