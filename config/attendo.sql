-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 10, 2025 at 08:50 PM
-- Server version: 10.11.10-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendo`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `attendance_status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `user_id`, `session_id`, `attendance_status`, `created_at`, `updated_at`) VALUES
(2, 3, 5, 0, '2025-01-10 19:46:37', '2025-01-10 19:46:37'),
(3, 2, 5, 2, '2025-01-10 19:46:37', '2025-01-10 19:48:12'),
(4, 4, 5, 0, '2025-01-10 19:46:37', '2025-01-10 19:46:37');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_sessions`
--

CREATE TABLE `attendance_sessions` (
  `id` int(11) NOT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `date` timestamp NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_sessions`
--

INSERT INTO `attendance_sessions` (`id`, `schedule_id`, `date`, `active`) VALUES
(5, 3, '2024-12-20 13:30:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `course_id` int(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `credits` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `course_id`, `name`, `credits`) VALUES
(1, 1, 'Intro To Programming', 3),
(2, 2, 'Object Oriented Programming', 3),
(4, 3, 'Operating Systems', 3);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `course_id` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `type`, `course_id`) VALUES
(1, 1, 0, 1),
(2, 3, 1, 1),
(3, 4, 0, 1),
(4, 5, 1, 2),
(5, 1, 0, 2),
(6, 2, 0, 2),
(7, 3, 1, 3),
(8, 2, 0, 3),
(9, 4, 0, 3);

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `room` varchar(255) NOT NULL,
  `mac_address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `room`, `mac_address`) VALUES
(1, 'H911', '00:1A:2B:3C:4D:5E'),
(2, 'H907', '0e:71:35:36:2d:17'),
(3, 'H1006', '30:3c:d6:ef:5e:98'),
(4, 'M324', '9b:a6:0c:0c:32:cd'),
(5, 'H712', '5d:df:33:46:7f:e9'),
(6, 'H1005', '2b:a2:1f:c8:19:6e');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `days` text DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `course_id`, `location_id`, `days`, `start_time`, `end_time`) VALUES
(1, 1, 1, 'Monday', '08:00:00', '10:00:00'),
(2, 1, 2, 'Tuesday', '12:00:00', '15:00:00'),
(3, 2, 5, 'Thursday', '14:00:00', '16:00:00'),
(4, 2, 6, 'Friday', '08:00:00', '11:00:00'),
(5, 3, 2, 'Wednesday', '10:00:00', '12:00:00'),
(6, 3, 4, 'Thursday', '16:00:00', '19:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_id`, `first_name`, `last_name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(2, 1, 'Ahmad', 'Dayeh', 'ahmad@gmail.com', '$2b$10$pvCZbAMrr1cuKPTCJQCvQOKdBKCHy5bHwUI19P/W5mb4/9bDw6jV6', '2024-10-30 21:43:07', '2024-10-30 21:43:07'),
(10, 2, 'Rami', 'Saleh', 'rami@gmail.com', '$2b$10$Zcfs4tTsVOmnr0MiygfNcO8ugf2iIn2oMvrsDSyGB60/eX4xM27/G', '2025-01-10 21:27:02', '2025-01-10 21:27:02'),
(11, 3, 'Lama', 'Aafara', 'lama@gmail.com', '$2b$10$8HHjS2wHyTGMfKQnDDlj5epCpg9K3WZxjvkfRW6rwUnVc3WZMUI/y', '2025-01-10 21:27:15', '2025-01-10 21:27:15'),
(12, 4, 'Abd El Karim', 'Chehadeh', 'abdelkarim@gmail.com', '$2b$10$JhkVLLJIWA58XTJEqb4J.ucDrgkH9XYVaWErhgGDBgKytum00cM7K', '2025-01-10 21:28:48', '2025-01-10 21:28:48'),
(13, 5, 'Bilal', 'Nakhal', 'bilal@gmail.com', '$2b$10$LIsJ1gbO.22/gIuDKwdMDO4lHAJz19D.u.1k/Gm9TgwQzg0YcJE0m', '2025-01-10 21:29:07', '2025-01-10 21:29:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedule_id` (`schedule_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_id` (`course_id`),
  ADD UNIQUE KEY `course_id_2` (`course_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_course_id_iknd` (`course_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_value_column` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `attendance_sessions` (`id`);

--
-- Constraints for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  ADD CONSTRAINT `attendance_sessions_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_course_id_iknd` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`),
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
