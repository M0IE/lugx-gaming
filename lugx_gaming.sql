-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2025 at 05:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Database: `lugx_gaming`

-- --------------------------------------------------------

-- Table structure for table `categories`
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert data for table `categories`
INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Action'),
(2, 'Strategy'),
(3, 'Racing'),
(4, 'Adventure');

-- --------------------------------------------------------

-- Table structure for table `invoices`
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `game_id` varchar(50) NOT NULL,
  `purchase_date` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_data` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_invoices_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Table structure for table `products`
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `gameId` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gameId` (`gameId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert data for table `products`
INSERT INTO `products` (`id`, `name`, `description`, `price`, `original_price`, `image`, `category`, `gameId`) VALUES
(1, 'Assassin\'s Creed Valhalla', 'Assassin\'s Creed Valhalla es un videojuego desarrollado por Ubisoft Montreal...', 90.00, 36.00, 'assets/images/trending-01.jpg', 'Action', 'AC-VAL'),
(2, 'Age of Empires IV', 'Age of Empires IV es un videojuego de estrategia en tiempo real desarrollado por Relic Entertainment...', 40.00, 32.00, 'assets/images/trending-02.jpg', 'Strategy', 'AOE-IV'),
(3, 'Need for Speed Heat', 'Need for Speed Heat es un videojuego de carreras desarrollado por Ghost Games...', 30.00, 45.00, 'assets/images/trending-03.jpg', 'Racing', 'NFS-HEAT'),
(4, 'Warcraft III: Reforged', 'Warcraft III: Reforged es un videojuego de estrategia en tiempo real desarrollado y publicado por Blizzard Entertainment...', 22.00, 32.00, 'assets/images/trending-04.jpg', 'Strategy', 'WC3-RF');

-- --------------------------------------------------------

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert data for table `users`
INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`) VALUES
(1, 'Marcos', 'admin_password', 'marco@gmail.com', 'admin'),
(2, 'user1', 'user1_password', 'user1@example.com', 'user'),
(3, 'user2', 'user2_password', 'user2@example.com', 'user');

-- --------------------------------------------------------

-- AUTO_INCREMENT for dumped tables
ALTER TABLE `categories` AUTO_INCREMENT = 5;
ALTER TABLE `invoices` AUTO_INCREMENT = 1;
ALTER TABLE `products` AUTO_INCREMENT = 5;
ALTER TABLE `users` AUTO_INCREMENT = 4;

COMMIT;
