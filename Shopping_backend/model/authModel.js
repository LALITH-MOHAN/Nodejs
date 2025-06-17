import User from '../models/userModel.js';

export const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

export const createUser = async (userData) => {
  const { name, email, password, role = 'customer' } = userData;
  const user = await User.create({ name, email, password, role });
  return user.id;
};

export const findUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'role']
  });
};

export const checkEmailExists = async (email) => {
  const user = await User.findOne({ 
    where: { email },
    attributes: ['id']
  });
  return !!user;
};