import User from '../models/User.js';

// Get all users
export const getUsers = async () => {
  return await User.findAll({
    attributes: ['id', 'name', 'email']
  });
};

// Get user by email
export const getUserByEmail = async (email) => {
  return await User.findOne({
    where: { email }
  });
};

// Add new user
export const addUser = async (name, email, password) => {
  const newUser = await User.create({ name, email, password });
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  };
};

// Delete user by ID
export const deleteUser = async (id) => {
  await User.destroy({
    where: { id }
  });
};
