-- Script SQL para importar en phpMyAdmin (XAMPP)
CREATE DATABASE IF NOT EXISTS salud360 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE salud360;

-- Tabla de Usuarios (Afiliados)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    document_type VARCHAR(20) NOT NULL,
    document_number VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL,
    affiliation_status VARCHAR(50) NOT NULL DEFAULT 'Afiliado Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Citas Médicas
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    assigned_location VARCHAR(150) NOT NULL,
    state ENUM('ACTIVE', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de Doctores (Catálogo inicial)
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    specialty VARCHAR(100) NOT NULL
);

-- Tabla de Sedes (Catálogo inicial)
CREATE TABLE IF NOT EXISTS places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    address VARCHAR(150) NOT NULL,
    emergency_phone VARCHAR(30) NOT NULL
);

-- Datos de prueba iniciales
INSERT INTO doctors (full_name, specialty) VALUES
('Dra. Laura Gómez', 'Medicina General'),
('Dr. Carlos Mendoza', 'Especialistas');

INSERT INTO places (name, address, emergency_phone) VALUES
('Sede Central Medellín', 'Calle 50 #45-12', '604-1234567'),
('Sede Norte (Bello)', 'Diagonal 55 #20-30', '604-9876543');
