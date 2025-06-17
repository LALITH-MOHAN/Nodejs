import {
  registerUser,
  loginUser,
  getCurrentUserProfile
} from '../services/authService.js';
import { getModuleLogger } from '../utils/logger.js';

const logger = getModuleLogger('user');

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    logger.info(`User registered via controller: ${result.user.email}`);
    res.status(201).json(result);
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    logger.info(`User login via controller: ${result.user.email}`);
    res.json(result);
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(401).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getCurrentUserProfile(req.user.id);
    logger.info(`Fetched user profile via controller: ${user.email}`);
    res.json(user);
  } catch (error) {
    logger.error(`Error fetching profile: ${error.message}`);
    res.status(404).json({ message: error.message });
  }
};
