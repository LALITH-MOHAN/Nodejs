// models/userModel.js
import db from '../config/db.js';

// Get all users
export const getUsers = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};

// Get user by ID
export const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

// Add a new user
export const addUser = async (name) => {
  const [result] = await db.query('INSERT INTO users (name) VALUES (?)', [name]);
  return { id: result.insertId, name };
};

// Update a user
export const updateUser = async (id, name) => {
  await db.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
  return { id, name };
};

// Delete a user
export const deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
  return { message: `User with ID ${id} deleted` };
};
