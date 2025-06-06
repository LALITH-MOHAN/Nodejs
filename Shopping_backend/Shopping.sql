CREATE DATABASE  shopping_cart;
USE shopping_cart;

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,  -- Changed from 'name' to match React's product.title
    price DECIMAL(10,2) NOT NULL,
    thumbnail VARCHAR(512),       -- Used in CartPage.jsx
    images JSON,                  -- For multiple images (like dummyjson API)
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),           -- Additional product info
    rating DECIMAL(3,2) DEFAULT 0,
    discountPercentage DECIMAL(5,2) DEFAULT 0,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert products with updated field names
INSERT INTO products (id, title, price, thumbnail, stock, description, category, brand) VALUES
(1, 'iPhone 9', 549.00, 'https://placehold.co/300x300?text=iPhone+9', 94, 'An apple mobile which is nothing like apple', 'smartphones', 'Apple'),
(2, 'iPhone X', 899.00, 'https://placehold.co/300x300?text=iPhone+X', 34, 'Model A19211 6.5-inch Super Retina HD display', 'smartphones', 'Apple'),
(3, 'Samsung Universe 9', 1249.00, 'https://placehold.co/300x300?text=Samsung+Universe+9', 36, 'Goes beyond Galaxy to the Universe', 'smartphones', 'Samsung'),
(4, 'OPPOF19', 280.00, 'https://placehold.co/300x300?text=OPPO+F19', 123, 'OPPO F19 announced on April 2021', 'smartphones'),
(5, 'Huawei P30', 499.00, 'https://placehold.co/300x300?text=Huawei+P30', 32, 'Huawei P30 with triple camera setup', 'smartphones'),
(6, 'MacBook Pro', 1749.00, 'https://placehold.co/300x300?text=MacBook+Pro', 83, 'MacBook Pro 2021 with M1 chip', 'laptops'),
(7, 'Samsung Galaxy Book', 1499.00, 'https://placehold.co/300x300?text=Galaxy+Book', 50, 'Samsung laptop with AMOLED display', 'laptops'),
(8, 'Microsoft Surface 4', 1499.00, 'https://placehold.co/300x300?text=Surface+4', 68, 'Microsoft Surface Laptop 4 15”', 'laptops'),
(9, 'Infinix INBOOK', 1099.00, 'https://placehold.co/300x300?text=Infinix+INBOOK', 96, 'Infinix Inbook X1 Laptop', 'laptops'),
(10, 'HP Pavilion 15', 1099.00, 'https://placehold.co/300x300?text=HP+Pavilion+15', 89, 'HP Pavilion Gaming Laptop', 'laptops'),
(11, 'Perfume Oil', 13.00, 'https://placehold.co/300x300?text=Perfume+Oil', 65, 'Mega Discount perfume oil', 'fragrances'),
(12, 'Brown Perfume', 40.00, 'https://placehold.co/300x300?text=Brown+Perfume', 52, 'Royal_Mirage Sport Brown Perfume', 'fragrances'),
(13, 'Fog Scent Xpressio', 13.99, 'https://placehold.co/300x300?text=Fog+Xpressio', 61, 'Strong lasting body spray', 'fragrances'),
(14, 'Non-Alcoholic Perfume', 120.00, 'https://placehold.co/300x300?text=Non-Alcoholic+Perfume', 114, 'High quality non-alcoholic scent', 'fragrances'),
(15, 'Eau De Perfume Spray', 30.00, 'https://placehold.co/300x300?text=Eau+De+Perfume', 105, 'Top quality spray for long lasting', 'fragrances'),
(16, 'Dry Rose Lipstick', 15.50, 'https://placehold.co/300x300?text=Rose+Lipstick', 85, 'Moisturizing matte lipstick', 'beauty'),
(17, 'Matte Foundation', 12.00, 'https://placehold.co/300x300?text=Matte+Foundation', 70, 'Lightweight matte foundation', 'beauty'),
(18, 'Sun Block Cream', 8.75, 'https://placehold.co/300x300?text=Sun+Block', 58, 'SPF 50+ sunblock for all skin', 'beauty'),
(19, 'Black Whisk', 9.99, 'https://placehold.co/300x300?text=Black+Whisk', 73, 'Kitchen whisk with ergonomic handle', 'kitchen-accessories'),
(20, 'Silicone Spatula Set', 14.99, 'https://placehold.co/300x300?text=Spatula+Set', 60, 'Heat-resistant silicone spatula set', 'kitchen-accessories');
;

-- Users table (matches AuthContext.jsx)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cart items (matches CartContext.jsx)
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, product_id)  -- Prevent duplicate items
);

-- Orders (matches OrderContext.jsx)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items (matches OrdersPage.jsx)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,  -- Denormalized for history
    price DECIMAL(10,2) NOT NULL, -- Snapshot of price at order time
    quantity INT NOT NULL,
    thumbnail VARCHAR(512),       -- Snapshot of product image
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Add admin user (matches your AuthContext.jsx admin credentials)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@gmail.com', '$2a$10$hashedpassword', 'admin');