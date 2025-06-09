import db from '../config/db.js';

export const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const createUser = async (userData) => {
  const { name, email, password, role = 'customer' } = userData;
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return result.insertId;
};

export const findUserById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, name, email, role FROM users WHERE id = ?', 
    [id]
  );
  return rows[0];
};

export const checkEmailExists = async (email) => {
  const [rows] = await db.query(
    'SELECT id FROM users WHERE email = ?', 
    [email]
  );
  return rows.length > 0;
};