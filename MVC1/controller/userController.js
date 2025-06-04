import { getUsers, addUser, updateUser, deleteUser } from '../model/userModel.js';

export const listUsers = (req, res) => {
  res.json(getUsers());
};

export const createUser = (req, res) => {
  const { name } = req.body;
  const newUser = addUser(name);
  res.status(201).json(newUser);
};

export const editUser = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const updatedUser = updateUser(Number(id), name);
  if (updatedUser) res.json(updatedUser);
  else res.status(404).json({ error: 'User not found' });
};

export const removeUser = (req, res) => {
  deleteUser(Number(req.params.id));
  res.status(204).end();
};
