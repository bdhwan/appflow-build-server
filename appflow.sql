-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: db-master
-- 생성 시간: 19-06-23 16:55
-- 서버 버전: 10.3.13-MariaDB-1:10.3.13+maria~bionic-log
-- PHP 버전: 7.2.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `appflow`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `apps`
--

CREATE TABLE `apps` (
  `apps_idx` int(11) NOT NULL,
  `app_id` varchar(100) NOT NULL,
  `channel_name` varchar(100) NOT NULL,
  `git_url` varchar(255) NOT NULL,
  `git_user_pw` varchar(100) DEFAULT NULL,
  `git_user_id` varchar(100) DEFAULT NULL,
  `cache_url` varchar(200) NOT NULL,
  `endpoint` varchar(200) NOT NULL,
  `android_link` varchar(255) DEFAULT NULL,
  `ios_link` varchar(255) DEFAULT NULL,
  `auto_update` tinyint(1) NOT NULL DEFAULT 0,
  `regist_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `update_datetime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `apps_version`
--

CREATE TABLE `apps_version` (
  `apps_version_idx` int(11) NOT NULL,
  `apps_idx` int(11) NOT NULL,
  `build` int(11) NOT NULL,
  `snapshot` varchar(100) NOT NULL,
  `url` varchar(500) DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `regist_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `update_datetime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `build_history`
--

CREATE TABLE `build_history` (
  `build_history_idx` int(11) NOT NULL,
  `apps_idx` int(11) NOT NULL,
  `build_history_uuid` varchar(100) NOT NULL,
  `success` tinyint(1) DEFAULT 0,
  `status` enum('ready','building','done','') NOT NULL DEFAULT 'ready',
  `build_duration` int(11) DEFAULT 0,
  `error` text DEFAULT NULL,
  `log` text DEFAULT NULL,
  `regist_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `update_datetime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `system`
--

CREATE TABLE `system` (
  `user_id` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `apps`
--
ALTER TABLE `apps`
  ADD PRIMARY KEY (`apps_idx`),
  ADD UNIQUE KEY `app_id` (`app_id`),
  ADD KEY `channel_name` (`channel_name`);

--
-- 테이블의 인덱스 `apps_version`
--
ALTER TABLE `apps_version`
  ADD PRIMARY KEY (`apps_version_idx`);

--
-- 테이블의 인덱스 `build_history`
--
ALTER TABLE `build_history`
  ADD PRIMARY KEY (`build_history_idx`),
  ADD KEY `status_index` (`status`);

--
-- 테이블의 인덱스 `system`
--
ALTER TABLE `system`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_pw` (`password`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `apps`
--
ALTER TABLE `apps`
  MODIFY `apps_idx` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `apps_version`
--
ALTER TABLE `apps_version`
  MODIFY `apps_version_idx` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `build_history`
--
ALTER TABLE `build_history`
  MODIFY `build_history_idx` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
