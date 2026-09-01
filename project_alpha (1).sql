-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 01, 2026 at 01:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_alpha`
--

-- --------------------------------------------------------

--
-- Table structure for table `pa_admins`
--

CREATE TABLE `pa_admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `refresh_token` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_admins`
--

INSERT INTO `pa_admins` (`id`, `name`, `email`, `password`, `status`, `created_at`, `updated_at`, `refresh_token`) VALUES
(1, 'Alpha Admin', 'admin@alpha.com', '$2b$10$uPtW2y3uWdZP0OUOSlkOP.cacO0YJlVlUjK/SN538EaRiCdryLeqy', 'active', '2026-08-19 07:16:17', '2026-08-20 13:00:29', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhbHBoYS5jb20iLCJpYXQiOjE3ODcxMjM4ODEsImV4cCI6MTc4NzcyODY4MX0.yUrijgNfp5jnE-6s2CQx4rbBNs5ok2qmXNBJRf9Tgds');

-- --------------------------------------------------------

--
-- Table structure for table `pa_banners`
--

CREATE TABLE `pa_banners` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `img` varchar(500) NOT NULL,
  `link` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  `position` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_banners`
--

INSERT INTO `pa_banners` (`id`, `title`, `img`, `link`, `sort_order`, `status`, `position`, `created_at`, `updated_at`) VALUES
(1, 'Special Masala Offer', '/uploads/1787208613216-927024239.png', '/product', 1, 0, 'top', '2026-08-20 06:50:13', '2026-08-20 06:54:50');

-- --------------------------------------------------------

--
-- Table structure for table `pa_bulk_orders`
--

CREATE TABLE `pa_bulk_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(100) NOT NULL,
  `current_step` int(11) NOT NULL DEFAULT 1,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(10) UNSIGNED DEFAULT NULL,
  `weight_id` bigint(20) UNSIGNED DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `preferred_delivery_date` date DEFAULT NULL,
  `status` enum('draft','submitted','cancelled') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_bulk_orders`
--

INSERT INTO `pa_bulk_orders` (`id`, `session_id`, `current_step`, `name`, `email`, `phone`, `company_name`, `address`, `city`, `state`, `pincode`, `product_id`, `quantity`, `weight_id`, `requirements`, `preferred_delivery_date`, `status`, `created_at`, `updated_at`) VALUES
(1, '01c13938-8642-42ca-87b5-71044823e645', 4, 'Rahul Sharma', 'rahul@example.com', '9876543210', 'Rahul Foods', 'Plot No 123, Rasulgarh', 'Bhubaneswar', 'Odisha', '751010', 4, 500, 2, 'Need wholesale packagi ', '2026-09-02', 'submitted', '2026-08-26 10:54:21', '2026-08-26 11:17:00'),
(2, 'e79d6db9-b56f-4a6e-b201-bb6c7adf96ee', 4, 'Rahul Sharma', 'rahul@example.com', '9876543210', 'Rahul Foods', 'Plot No 123, Rasulgarh', 'Bhubaneswar', 'Odisha', '751010', NULL, NULL, NULL, 'Need wholesale packaging ', '2012-02-06', 'submitted', '2026-08-27 09:22:35', '2026-08-27 09:26:27'),
(3, '4b96d080-4236-484f-a4c3-04ead53afce3', 1, 'gfhr', 'op@GMAIL.COM', '7686586878', 'dgfhdhgg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'draft', '2026-08-27 10:33:05', '2026-08-27 10:33:05'),
(4, '8e205d2e-41ce-476e-bca1-aaab3e9868d7', 1, 'gfhr', 'op@GMAIL.COM', '7686586878', 'dgfhdhgg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'draft', '2026-08-27 10:33:27', '2026-08-27 10:33:27'),
(5, '1c97ff7f-04a2-4223-a794-54f760b581af', 1, 'gfhr', 'op@GMAIL.COM', '7686586878', 'dgfhdhgg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'draft', '2026-08-27 10:33:31', '2026-08-27 10:33:31'),
(6, '696ec2c6-9174-41d5-96ac-ada76f9c413a', 1, 'PK', 'OK@GMAIL.COM', '9064923190', 'OK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'draft', '2026-08-27 10:34:04', '2026-08-27 10:34:04'),
(7, '0932e95b-2f47-4ad9-b96a-eacf6a478923', 1, 'PK', 'OK@GMAIL.COM', '9064923190', 'OK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'draft', '2026-08-27 10:34:48', '2026-08-27 10:34:48'),
(8, '12ba9c0a-c46b-4473-9e0c-9e072bf87e12', 2, 'ANANDA CHANDA', 'ANANDACHANDA08@GMAIL.COM', '7063389331', 'FH', 'SORRONG,DANTAN ,PASCHIM MEDINIPUR', 'PASCHIM MEDINIPUR', 'WEST BENGAL', '721426', NULL, NULL, NULL, NULL, NULL, 'draft', '2026-08-27 10:44:22', '2026-08-27 10:51:07'),
(9, '6eb3c3b8-150b-4ce9-a346-7eb90b7fd939', 4, 'ANANDA CHANDA', 'ANANDACHANDA08@GMAIL.COM', '7063389331', 'OK', 'SORRONG,DANTAN ,PASCHIM MEDINIPUR', 'PASCHIM MEDINIPUR', 'WEST BENGAL', '721426', NULL, NULL, NULL, 'OK', '2026-08-28', 'submitted', '2026-08-27 10:58:04', '2026-08-27 10:59:11'),
(10, '46fa7bd4-7e06-4bf2-ba27-5f510687bbc5', 1, 'Anil', 'xyz6@gmail.com', '5566778899', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'draft', '2026-08-28 05:45:53', '2026-08-28 05:45:53');

-- --------------------------------------------------------

--
-- Table structure for table `pa_bulk_order_items`
--

CREATE TABLE `pa_bulk_order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bulk_order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(10) UNSIGNED DEFAULT NULL,
  `weight_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_bulk_order_items`
--

INSERT INTO `pa_bulk_order_items` (`id`, `bulk_order_id`, `product_id`, `category_id`, `quantity`, `weight_id`, `created_at`) VALUES
(1, 1, 4, 1, 500, 2, '2026-08-27 09:22:16'),
(6, 2, 1, 1, 100, 3, '2026-08-27 09:25:48'),
(7, 2, 2, 1, 50, 6, '2026-08-27 09:25:48'),
(31, 9, 1, 1, 1, 1, '2026-08-27 10:59:00'),
(32, 9, 2, 1, 1, 2, '2026-08-27 10:59:00'),
(33, 9, 3, 1, 1, 3, '2026-08-27 10:59:00'),
(34, 9, 4, 1, 1, 4, '2026-08-27 10:59:00');

-- --------------------------------------------------------

--
-- Table structure for table `pa_cart`
--

CREATE TABLE `pa_cart` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `weight_id` int(10) UNSIGNED NOT NULL,
  `weight` varchar(50) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_cart`
--

INSERT INTO `pa_cart` (`id`, `user_id`, `product_id`, `weight_id`, `weight`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(3, 'f048205a-bc12-43e3-9925-b7058920423e', 4, 2, '200g', 6, NULL, '2026-08-21 06:38:42', '2026-08-21 06:57:00');

-- --------------------------------------------------------

--
-- Table structure for table `pa_categories`
--

CREATE TABLE `pa_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `img_path` varchar(500) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
  `parent_category` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_categories`
--

INSERT INTO `pa_categories` (`id`, `name`, `img_path`, `status`, `parent_category`, `created_at`, `updated_at`) VALUES
(1, 'Masala', '/uploads/1787138583520-916571549.png', 1, NULL, '2026-08-19 11:23:03', '2026-08-27 10:02:07');

-- --------------------------------------------------------

--
-- Table structure for table `pa_contacts`
--

CREATE TABLE `pa_contacts` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read','replied','resolved') NOT NULL DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_contacts`
--

INSERT INTO `pa_contacts` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Rahul Kumar', 'rahul@example.com', '9876543210', 'Product Enquiry', 'I want to know more about your masala products.', 'read', '2026-08-21 05:49:22', '2026-08-21 05:50:55'),
(2, 'Rahul Kumar Bhuyana', 'rahul@example.com', '9876543210', 'Product Enquiry', 'I want to know more about your masala products.', 'unread', '2026-08-21 05:51:53', '2026-08-21 05:51:53');

-- --------------------------------------------------------

--
-- Table structure for table `pa_faqs`
--

CREATE TABLE `pa_faqs` (
  `id` int(10) UNSIGNED NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pa_feature_products`
--

CREATE TABLE `pa_feature_products` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_feature_products`
--

INSERT INTO `pa_feature_products` (`id`, `product_id`, `sort_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 1, '2026-09-01 05:27:44', '2026-09-01 05:27:44'),
(2, 2, 1, 1, '2026-09-01 05:27:44', '2026-09-01 05:27:44'),
(3, 3, 2, 1, '2026-09-01 05:27:44', '2026-09-01 05:27:44');

-- --------------------------------------------------------

--
-- Table structure for table `pa_orders`
--

CREATE TABLE `pa_orders` (
  `id` int(11) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('received','packaging','shipped','delivered','cancelled') DEFAULT 'received',
  `shipping_address` text NOT NULL,
  `payment_method` varchar(50) DEFAULT 'COD',
  `payment_status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_orders`
--

INSERT INTO `pa_orders` (`id`, `user_id`, `total_amount`, `status`, `shipping_address`, `payment_method`, `payment_status`, `created_at`, `updated_at`) VALUES
(2, 'fcec20a8-2db0-454b-89b7-809a9143fb5d', 350.00, 'received', '\"bbsr , odisha , 752010\"', 'COD', 'pending', '2026-08-28 06:12:48', '2026-08-28 06:12:48'),
(3, 'fcec20a8-2db0-454b-89b7-809a9143fb5d', 300.00, 'received', 'bbsr , odisha , 752010', 'COD', 'pending', '2026-08-28 07:09:25', '2026-08-28 07:09:25'),
(4, 'fcec20a8-2db0-454b-89b7-809a9143fb5d', 300.00, 'received', 'bbsr , odisha , 752010', 'COD', 'pending', '2026-08-28 07:14:28', '2026-08-28 07:14:28');

-- --------------------------------------------------------

--
-- Table structure for table `pa_order_items`
--

CREATE TABLE `pa_order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `weight_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_order_items`
--

INSERT INTO `pa_order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `weight_id`, `created_at`) VALUES
(3, 2, 1, 2, 150.00, 2, '2026-08-28 06:12:48'),
(4, 2, 3, 1, 50.00, 1, '2026-08-28 06:12:48'),
(5, 3, 4, 2, 150.00, 2, '2026-08-28 07:09:25'),
(6, 4, 4, 2, 150.00, 2, '2026-08-28 07:14:28');

-- --------------------------------------------------------

--
-- Table structure for table `pa_products`
--

CREATE TABLE `pa_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `weight_id` bigint(20) UNSIGNED NOT NULL,
  `weight_qty` varchar(20) DEFAULT NULL,
  `prod_name` varchar(255) NOT NULL,
  `regular_price` decimal(10,2) NOT NULL,
  `current_price` decimal(10,2) NOT NULL,
  `mrp` decimal(10,2) NOT NULL,
  `availability` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 = Available, 0 = Not Available',
  `current_stock` varchar(20) DEFAULT '0',
  `img` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`img`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_products`
--

INSERT INTO `pa_products` (`id`, `category_id`, `weight_id`, `weight_qty`, `prod_name`, `regular_price`, `current_price`, `mrp`, `availability`, `current_stock`, `img`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '50 gm ', 'Premium mirchi Masala', 120.00, 90.00, 130.00, 1, '0', '[\"/uploads/1787144784214-535597795.png\",\"/uploads/1787144784233-345044599.png\"]', '2026-08-19 13:06:24', '2026-08-19 13:27:27'),
(2, 1, 2, '100 gm', 'Premium Meat Masala', 120.00, 90.00, 130.00, 1, '0', '[\"/uploads/1787147490729-857308151.png\",\"/uploads/1787147490740-424634246.png\"]', '2026-08-19 13:27:11', '2026-08-19 13:51:30'),
(3, 1, 2, '100 gm', 'Premium Chicken Masala', 120.00, 90.00, 130.00, 1, '0', '[\"/uploads/1787147522379-483738115.png\",\"/uploads/1787147522389-828667096.png\"]', '2026-08-19 13:52:02', '2026-08-19 13:52:02'),
(4, 1, 2, '100 gm', 'Premium Masala', 120.00, 90.00, 130.00, 1, '118', '[\"/uploads/1787209831633-538945537.png\",\"/uploads/1787209831647-67049189.png\"]', '2026-08-20 07:10:31', '2026-08-28 07:14:28');

-- --------------------------------------------------------

--
-- Table structure for table `pa_testimonials`
--

CREATE TABLE `pa_testimonials` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `img` varchar(500) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `testimonials` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_testimonials`
--

INSERT INTO `pa_testimonials` (`id`, `name`, `img`, `designation`, `testimonials`, `created_at`, `updated_at`) VALUES
(1, 'Ashirbad', '/uploads/1787217924811-887349268.png', 'full stack developer ', 'the masalasof maastric is better than baharat', '2026-08-20 09:24:55', '2026-08-20 09:25:24');

-- --------------------------------------------------------

--
-- Table structure for table `pa_users`
--

CREATE TABLE `pa_users` (
  `user_id` varchar(40) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `verification_code` varchar(10) DEFAULT NULL,
  `verified` tinyint(4) NOT NULL DEFAULT 0,
  `password` varchar(255) NOT NULL,
  `password_reset_code` varchar(10) DEFAULT NULL,
  `password_reset_expires_at` datetime DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`address`)),
  `wishlist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`wishlist`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_users`
--

INSERT INTO `pa_users` (`user_id`, `name`, `email`, `verification_code`, `verified`, `password`, `password_reset_code`, `password_reset_expires_at`, `status`, `address`, `wishlist`, `created_at`, `updated_at`) VALUES
('f048205a-bc12-43e3-9925-b7058920423e', 'Ashirbad ', 'ashirbad1@gmail.com', NULL, 0, '$2b$10$YjVy//tltJltEr1SINVR7OqA8tgeazVUscMWfGeb9M0M9ZOCLxO1q', NULL, NULL, 'active', NULL, '[1]', '2026-08-19 10:09:35', '2026-08-20 13:08:15'),
('fcec20a8-2db0-454b-89b7-809a9143fb5d', 'Ashirbad ', 'ashirbad@gmail.com', NULL, 0, '$2b$10$UTO6Ux4se8h633atDeZOfe2j7VTMyvXK32Sz.I7PMqsLoB.xHsXwm', NULL, NULL, 'active', '\"bbsr , odisha , 752010\"', NULL, '2026-08-19 10:06:15', '2026-08-28 06:11:43');

-- --------------------------------------------------------

--
-- Table structure for table `pa_weights`
--

CREATE TABLE `pa_weights` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `qty` varchar(50) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pa_weights`
--

INSERT INTO `pa_weights` (`id`, `qty`, `status`, `created_at`, `updated_at`) VALUES
(1, '50 gm', 1, '2026-08-19 12:16:19', '2026-08-19 12:20:29'),
(2, '100 gm', 1, '2026-08-19 12:17:08', '2026-08-19 12:20:44'),
(3, '200 gm', 1, '2026-08-19 12:18:34', '2026-08-19 12:20:58'),
(4, '250 gm', 1, '2026-08-19 12:18:34', '2026-08-19 12:20:58'),
(5, '400 gm', 1, '2026-08-19 12:18:34', '2026-08-19 12:20:58'),
(6, '500 gm', 1, '2026-08-19 12:18:34', '2026-08-19 12:20:58'),
(7, '1 KG', 1, '2026-08-19 12:18:34', '2026-08-19 12:20:58'),
(8, '50 pieces', 1, '2026-08-19 12:18:34', '2026-08-19 12:20:58'),
(9, '100 pieces', 1, '2026-08-19 12:18:34', '2026-08-19 12:20:58'),
(10, '200 pieces', 1, '2026-08-19 12:18:34', '2026-08-19 12:20:58'),
(11, '500 pieces', 1, '2026-08-19 12:18:34', '2026-08-19 12:20:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pa_admins`
--
ALTER TABLE `pa_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `pa_banners`
--
ALTER TABLE `pa_banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pa_bulk_orders`
--
ALTER TABLE `pa_bulk_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `pa_bulk_order_items`
--
ALTER TABLE `pa_bulk_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_bulk_order_items_order` (`bulk_order_id`),
  ADD KEY `idx_bulk_order_items_product` (`product_id`),
  ADD KEY `idx_bulk_order_items_category` (`category_id`),
  ADD KEY `fk_bulk_order_items_weight` (`weight_id`);

--
-- Indexes for table `pa_cart`
--
ALTER TABLE `pa_cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_weight` (`user_id`,`product_id`,`weight_id`),
  ADD KEY `idx_pa_cart_user_id` (`user_id`),
  ADD KEY `idx_pa_cart_product_id` (`product_id`),
  ADD KEY `idx_pa_cart_weight_id` (`weight_id`);

--
-- Indexes for table `pa_categories`
--
ALTER TABLE `pa_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pa_contacts`
--
ALTER TABLE `pa_contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pa_faqs`
--
ALTER TABLE `pa_faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pa_feature_products`
--
ALTER TABLE `pa_feature_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_product` (`product_id`);

--
-- Indexes for table `pa_orders`
--
ALTER TABLE `pa_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pa_order_items`
--
ALTER TABLE `pa_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `pa_products`
--
ALTER TABLE `pa_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_category` (`category_id`),
  ADD KEY `idx_product_weight` (`weight_id`),
  ADD KEY `idx_product_availability` (`availability`);

--
-- Indexes for table `pa_testimonials`
--
ALTER TABLE `pa_testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pa_users`
--
ALTER TABLE `pa_users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `pa_weights`
--
ALTER TABLE `pa_weights`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pa_admins`
--
ALTER TABLE `pa_admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pa_banners`
--
ALTER TABLE `pa_banners`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pa_bulk_orders`
--
ALTER TABLE `pa_bulk_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pa_bulk_order_items`
--
ALTER TABLE `pa_bulk_order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `pa_cart`
--
ALTER TABLE `pa_cart`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pa_categories`
--
ALTER TABLE `pa_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pa_contacts`
--
ALTER TABLE `pa_contacts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pa_faqs`
--
ALTER TABLE `pa_faqs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pa_feature_products`
--
ALTER TABLE `pa_feature_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pa_orders`
--
ALTER TABLE `pa_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pa_order_items`
--
ALTER TABLE `pa_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pa_products`
--
ALTER TABLE `pa_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pa_testimonials`
--
ALTER TABLE `pa_testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pa_weights`
--
ALTER TABLE `pa_weights`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pa_bulk_order_items`
--
ALTER TABLE `pa_bulk_order_items`
  ADD CONSTRAINT `fk_bulk_order_items_category` FOREIGN KEY (`category_id`) REFERENCES `pa_categories` (`id`),
  ADD CONSTRAINT `fk_bulk_order_items_order` FOREIGN KEY (`bulk_order_id`) REFERENCES `pa_bulk_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bulk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `pa_products` (`id`),
  ADD CONSTRAINT `fk_bulk_order_items_weight` FOREIGN KEY (`weight_id`) REFERENCES `pa_weights` (`id`);

--
-- Constraints for table `pa_order_items`
--
ALTER TABLE `pa_order_items`
  ADD CONSTRAINT `pa_order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `pa_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pa_products`
--
ALTER TABLE `pa_products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `pa_categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_product_weight` FOREIGN KEY (`weight_id`) REFERENCES `pa_weights` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
