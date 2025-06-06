CREATE DATABASE  shopping_cart;
USE shopping_cart;

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    thumbnail VARCHAR(512),
    stock INT,
    description TEXT,
    category VARCHAR(100)
);

INSERT INTO products (id, name, price, thumbnail, stock, description, category) VALUES
(1, 'iPhone 9', 549.00, 'https://placehold.co/300x300?text=iPhone+9', 94, 'An apple mobile which is nothing like apple', 'smartphones'),
(2, 'iPhone X', 899.00, 'https://placehold.co/300x300?text=iPhone+X', 34, 'Model A19211 6.5-inch Super Retina HD display', 'smartphones'),
(3, 'Samsung Universe 9', 1249.00, 'https://placehold.co/300x300?text=Samsung+Universe+9', 36, 'Goes beyond Galaxy to the Universe', 'smartphones'),
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

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


