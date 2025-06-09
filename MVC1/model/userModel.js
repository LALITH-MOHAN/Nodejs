import db from '../config/db.js';

export const getUsers = async () => {
  const [rows] = await db.query('SELECT id, name, email FROM users');
  return rows;
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const addUser = async (name, email, password) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return { id: result.insertId, name, email };
};

export const deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
};