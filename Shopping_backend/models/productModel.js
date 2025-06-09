import db from "../config/db.js";

export const fetchAllProducts = async () => {
    const [rows] = await db.query('SELECT id, title, price, thumbnail, stock, description, category FROM products');
    return rows;
};

export const fetchProductById = async (id) => {
    const [rows] = await db.query('SELECT id, title, price, thumbnail, stock, description, category FROM products WHERE id = ?', [id]);
    return rows[0];
};
  
export const insertProduct = async ({ title, price, thumbnail, stock, description, category }) => {
    const [result] = await db.query(
      'INSERT INTO products (title, price, thumbnail, stock, description, category) VALUES (?, ?, ?, ?, ?, ?)',
      [title, price, thumbnail, stock, description, category]
    );
    return result.insertId;
};
  
export const updateProductById = async (id, data) => {
    const { title, price, thumbnail, stock, description, category } = data;
    await db.query(
      'UPDATE products SET title=?, price=?, thumbnail=?, stock=?, description=?, category=? WHERE id=?',
      [title, price, thumbnail, stock, description, category, id]
    );
};

export const deleteProductById = async (id) => {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
};

export const fetchProductsByCategory = async (category) => {
    const [rows] = await db.query(
      'SELECT id, title, price, thumbnail, stock, description, category FROM products WHERE category = ?',
      [category]
    );
    return rows;
};