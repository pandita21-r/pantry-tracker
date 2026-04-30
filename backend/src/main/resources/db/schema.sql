-- asdfasdflk;asdfasdfasdf
CREATE DATABASE IF NOT EXISTS pantry_db;
USE pantry_db;

CREATE TABLE pantry_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity DOUBLE,
    unit VARCHAR(50),
    expiration_date DATE,
    purchase_date DATE,
    notes TEXT,
    added_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE shopping_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(100),
    quantity DOUBLE,
    unit VARCHAR(50),
    checked BOOLEAN DEFAULT FALSE,
    added_at DATETIME
);