-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2021 at 10:14 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `selling-website`
--

-- --------------------------------------------------------

--
-- Table structure for table `favourite`
--

CREATE TABLE `favourite` (
  `favouritId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `favourite`
--

INSERT INTO `favourite` (`favouritId`, `userId`, `productId`) VALUES
(1, 5, 48),
(3, 5, 11),
(8, 4, 48);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productName` varchar(225) NOT NULL,
  `productContent` varchar(225) NOT NULL,
  `productImg` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productId`, `userId`, `productName`, `productContent`, `productImg`) VALUES
(11, 4, 'Product 1', '1234', 'BMW-M2-025.jpg'),
(43, 5, 'Product 2 ', 'Testing Delete', 'cadeira-my-chair-flexform-D_NQ_NP_749291-MLB30699249020_052019-F.jpg'),
(48, 5, 'Product 3', 'Testing 3 ', 'pilot-capless-fountain-pen-rhodium-trim-gloss-black.jpg'),
(49, 4, 'Product 4 ', 'Testing 4 ', '1579227982.5736496_Apple_Airpod_Pro_1.jpg'),
(50, 4, 'Product 5', 'Product 5 Description\r\nContact: 4444', 'vensmile-i10_3.jpg'),
(51, 6, 'Product 6', 'iwatch wowowow', 'apple-watch-ft.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` int(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `name`, `phone`, `email`, `password`) VALUES
(4, 'Matthew Tai', 23456789, 'longpingtai@gmail.com', '$2a$08$lZfZfq/HD2pA4612H//te.oHLcoU3mpduqnoti8vRxIedoJCIaElS'),
(5, 'Chan Tai Man', 36548792, 'taiman@gmail.com', '$2a$08$l8Xr9F84b7MTUzGvp0x0Su65k64UroAP2Ji1CybJ6wlOwzQUEU93S'),
(6, 'Siu Ming', 66897156, 'siuming@gmail.com', '$2a$08$6FR3RcW1hR6PxkCoYYt5UO9XviN.HvFpv58Nfh0DMr3gwZb523Te.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favourite`
--
ALTER TABLE `favourite`
  ADD PRIMARY KEY (`favouritId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favourite`
--
ALTER TABLE `favourite`
  MODIFY `favouritId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
