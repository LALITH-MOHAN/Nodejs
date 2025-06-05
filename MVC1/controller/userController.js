import { getUsers, addUser, updateUser, deleteUser } from '../model/userModel.js';

export const listUsers = async (req, res) => {
  const users = await getUsers();
  res.json(users);
};

export const createUser = async (req, res) => {
  const { name } = req.body;
  const newUser = await addUser(name);
  res.status(201).json(newUser);
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const updatedUser = await updateUser(Number(id), name);
  if (updatedUser) res.json(updatedUser);
  else res.status(404).json({ error: 'User not found' });
};

export const removeUser = async (req, res) => {
  await deleteUser(Number(req.params.id));
  res.status(204).end();
};
