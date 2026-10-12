CREATE DATABASE IF NOT EXISTS cafe_db;
USE cafe_db;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drink_name VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    sugar_level VARCHAR(20) NOT NULL,
    ice_level VARCHAR(20) NOT NULL,
    order_type VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    reference_number VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);