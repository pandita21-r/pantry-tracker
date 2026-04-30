-- 1. Create Database
CREATE DATABASE IF NOT EXISTS pantry_tracker_db;
USE pantry_tracker_db;

-- 2. Users Table (Based on User type[cite: 5])
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Added for Spring Security later
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pantry Items Table (Based on PantryItem type[cite: 3, 5])
CREATE TABLE IF NOT EXISTS pantry_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(255) NOT NULL,
    category ENUM(
        'Produce', 'Dairy', 'Meat & Seafood', 'Grains & Bread', 
        'Canned Goods', 'Frozen', 'Beverages', 'Snacks', 
        'Condiments', 'Spices', 'Other'
    ) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1.0, -- Decimal to support units like 1.5 lbs[cite: 7]
    unit VARCHAR(50) NOT NULL DEFAULT 'pcs',
    expiration_date DATE,
    purchase_date DATE NOT NULL,
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Shopping List Table (Based on ShoppingItem type[cite: 3, 5])
CREATE TABLE IF NOT EXISTS shopping_list (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity DECIMAL(10, 2) DEFAULT 1.0,
    unit VARCHAR(50),
    checked BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);