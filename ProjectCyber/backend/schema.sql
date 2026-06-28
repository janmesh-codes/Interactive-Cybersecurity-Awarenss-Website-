-- ============================================================
-- SecureGate — schema.sql
-- Run this once against your MySQL server before using the app:
--   mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS securegate
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE securegate;

-- Dedicated app user (recommended over using root from PHP).
-- Update the password to match backend/db.php, then restrict
-- privileges to just this database.
CREATE USER IF NOT EXISTS 'securegate_app'@'localhost' IDENTIFIED BY 'CHANGE_ME';
GRANT SELECT, INSERT, UPDATE ON securegate.* TO 'securegate_app'@'localhost';
FLUSH PRIVILEGES;

-- ----------------------------------------------------------------
-- users
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(120)      NOT NULL,
  email           VARCHAR(190)      NOT NULL,
  phone           VARCHAR(20)       NOT NULL,
  password_hash   VARCHAR(255)      NOT NULL,
  created_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- audit_log — records every registration / login event, success
-- or failure, including duplicate-detection events.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_type  ENUM(
                'REGISTER_SUCCESS',
                'REGISTER_FAILED',
                'DUPLICATE_DETECTED',
                'LOGIN_SUCCESS',
                'LOGIN_FAILED',
                'LOGIN_BLOCKED'
              )                NOT NULL,
  email       VARCHAR(190)     NULL,
  ip_address  VARCHAR(45)      NULL,
  user_agent  VARCHAR(255)     NULL,
  status      ENUM('SUCCESS', 'FAILURE') NOT NULL,
  message     VARCHAR(255)     NULL,
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_audit_email (email),
  KEY idx_audit_event (event_type),
  KEY idx_audit_created (created_at)
) ENGINE=InnoDB;
