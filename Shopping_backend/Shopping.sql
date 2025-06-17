CREATE DATABASE shopping_cart;
USE shopping_cart;



 INSERT INTO products (title, price, thumbnail, stock, description, category, created_at) VALUES ('iPhone 9', 549.00, 'http://localhost:3000/products/iphone9.jpg', 85, 'An apple mobile which is nothing like apple', 'smartphones', NOW()), ('iPhone X', 898.00, '/products/iPhoneX.jpg', 30, 'Model A19211 6.5-inch Super Retina HD display', 'smartphones', NOW()), ('Samsung Universe 9', 1249.00, '/products/samsung_universe_9_1749779989595.jpg', 38, 'Goes beyond Galaxy to the Universe', 'smartphones', NOW()), ('OPPOF19', 280.00, '/products/oppof19_1749780393080.jpg', 122, 'OPPO F19 announced on April 2021', 'smartphones', NOW()), ('Huawei P30', 499.00, '/products/huawei_p30_1749780543588.jpeg', 31, 'Huawei P30 with triple camera setup', 'smartphones', NOW()), ('MacBook Pro', 1749.00, '/products/macbook_pro_1749780608943.jpg', 83, 'MacBook Pro 2021 with M1 chip', 'laptops', NOW()), ('Samsung Galaxy Book', 1499.00, '/products/samsung_galaxy_book_1749781526124.webp', 50, 'Samsung laptop with AMOLED display', 'laptops', NOW()), ('Microsoft Surface 4', 1499.00, '/products/microsoft_surface_4_1749781629353.webp', 70, 'Microsoft Surface Laptop 4 15"', 'laptops', NOW()), ('HP Pavilion 15', 1099.00, '/products/hp_pavilion_15_1749781706274.jpg', 88, 'HP Pavilion Gaming
Laptop', 'laptops', NOW()), ('Perfume Oil', 13.00, '/products/perfume_oil_1749781761329.jpg', 53, 'Mega Discount perfume oil', 'fragrances', NOW()), ('Brown Perfume', 40.00, 'https://placehold.co/300x300?text=Brown+Perfume', 51, 'Royal_Mirage Sport Brown Perfume', 'fragrances', NOW()), ('Fog Scent Xpressio', 13.99, 'https://placehold.co/300x300?text=Fog+Xpressio', 61, 'Strong lasting body spray', 'fragrances', NOW()), ('Non-Alcoholic Perfume', 120.00, 'https://placehold.co/300x300?text=Non-Alcoholic+Perfume', 65, 'High quality non-alcoholic scent', 'fragrances', NOW()), ('Eau De Perfume Spray', 30.00, 'https://placehold.co/300x300?text=Eau+De+Perfume', 105, 'Top quality spray for long lasting', 'fragrances', NOW()), ('Dry Rose Lipstick', 15.50, 'https://placehold.co/300x300?text=Rose+Lipstick', 80, 'Moisturizing matte lipstick', 'beauty', NOW()), ('Matte Foundation', 12.00, 'https://placehold.co/300x300?text=Matte+Foundation', 68, 'Lightweight matte foundation', 'beauty', NOW()), ('Sun Block Cream', 8.75, 'https://placehold.co/300x300?text=Sun+Block', 58, 'SPF 50+ sunblock for all skin', 'beauty', NOW()), ('Black Whisk', 9.99, 'https://placehold.co/300x300?text=Black+Whisk', 73, 'Kitchen whisk with ergonomic handle', 'kitchen-accessories', NOW()), ('HOUSE',
12222.00, '/products/house_1749781831732.webp', 1, '1 bhk house', 'home', NOW());
Query OK, 19 rows affected (0.01 sec)

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,  
    price DECIMAL(10,2) NOT NULL, 
    thumbnail VARCHAR(512),       
    stock INT DEFAULT 0,          
    description TEXT,             
    category VARCHAR(100),        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, product_id)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    thumbnail VARCHAR(512),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@gmail.com', ' $2b$10$uoMo3Z.MYsFOAB4emyTWxemQOG9D1pyW.v5yUR/pyZ.WSnDOukvb2 ', 'admin');