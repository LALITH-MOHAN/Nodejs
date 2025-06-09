import mysql from 'mysql2/promise';

const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'shopping_cart',
  waitForConnections: true,
  connectionLimit: 10
});

export default db;