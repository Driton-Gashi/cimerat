
-- 1. Users (cimerat)
CREATE TABLE `cimerat` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(500) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `global_role` ENUM('platform_admin') NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Apartments
CREATE TABLE `apartments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `apartments_created_by` FOREIGN KEY (`created_by`) REFERENCES `cimerat` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Apartment membership (user ↔ apartment, role)
CREATE TABLE `apartment_members` (
  `user_id` INT(11) NOT NULL,
  `apartment_id` INT(11) NOT NULL,
  `role` ENUM('admin','member') NOT NULL DEFAULT 'member',
  `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `apartment_id`),
  KEY `apartment_id` (`apartment_id`),
  CONSTRAINT `apartment_members_user` FOREIGN KEY (`user_id`) REFERENCES `cimerat` (`id`) ON DELETE CASCADE,
  CONSTRAINT `apartment_members_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Invitations to join an apartment
CREATE TABLE `invitations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `apartment_id` INT(11) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `invited_by` INT(11) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `status` ENUM('pending','accepted','expired') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `apartment_id` (`apartment_id`),
  KEY `invited_by` (`invited_by`),
  CONSTRAINT `invitations_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `invitations_invited_by` FOREIGN KEY (`invited_by`) REFERENCES `cimerat` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User current apartment preference
CREATE TABLE `user_preferences` (
  `user_id` INT(11) NOT NULL,
  `current_apartment_id` INT(11) NULL,
  PRIMARY KEY (`user_id`),
  KEY `current_apartment_id` (`current_apartment_id`),
  CONSTRAINT `user_preferences_user` FOREIGN KEY (`user_id`) REFERENCES `cimerat` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_preferences_apartment` FOREIGN KEY (`current_apartment_id`) REFERENCES `apartments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Complaints (scoped by apartment)
CREATE TABLE `complaints` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `image_url` TEXT NOT NULL,
  `complaints_date` DATE NOT NULL,
  `complainer_id` INT(11) NOT NULL,
  `suspect_id` INT(11) NOT NULL,
  `apartment_id` INT(11) NOT NULL,
  `created_by` INT(11) NOT NULL,
  `status` ENUM('open','resolved') NOT NULL DEFAULT 'open',
  `resolved_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `complainer` (`complainer_id`),
  KEY `suspect` (`suspect_id`),
  KEY `apartment_id` (`apartment_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `complaints_complainer` FOREIGN KEY (`complainer_id`) REFERENCES `cimerat` (`id`),
  CONSTRAINT `complaints_suspect` FOREIGN KEY (`suspect_id`) REFERENCES `cimerat` (`id`),
  CONSTRAINT `complaints_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `complaints_created_by` FOREIGN KEY (`created_by`) REFERENCES `cimerat` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Loans (scoped by apartment)
CREATE TABLE `loans` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `loan_date` DATE NOT NULL,
  `loaner_id` INT(11) NOT NULL,
  `loanee_id` INT(11) NOT NULL,
  `amount` INT(11) NOT NULL,
  `status` ENUM('paid','unpaid') NOT NULL DEFAULT 'unpaid',
  `apartment_id` INT(11) NOT NULL,
  `created_by` INT(11) NOT NULL,
  `paid_at` DATETIME DEFAULT NULL,
  `paid_by` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loaner_id` (`loaner_id`),
  KEY `loanee_id` (`loanee_id`),
  KEY `apartment_id` (`apartment_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `loans_loaner` FOREIGN KEY (`loaner_id`) REFERENCES `cimerat` (`id`),
  CONSTRAINT `loans_loanee` FOREIGN KEY (`loanee_id`) REFERENCES `cimerat` (`id`),
  CONSTRAINT `loans_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `loans_created_by` FOREIGN KEY (`created_by`) REFERENCES `cimerat` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Payments (scoped by apartment)
CREATE TABLE `payments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `category` ENUM('Personal','Product','Bills') NOT NULL DEFAULT 'Personal',
  `name` VARCHAR(50) NOT NULL,
  `transaction_date` DATE NOT NULL,
  `payer_id` INT(11) NOT NULL,
  `amount` INT(11) NOT NULL,
  `status` ENUM('paid','unpaid') NOT NULL DEFAULT 'unpaid',
  `apartment_id` INT(11) NOT NULL,
  `created_by` INT(11) NOT NULL,
  `paid_at` DATETIME DEFAULT NULL,
  `paid_by` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payer_id` (`payer_id`),
  KEY `apartment_id` (`apartment_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `payments_payer` FOREIGN KEY (`payer_id`) REFERENCES `cimerat` (`id`),
  CONSTRAINT `payments_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_created_by` FOREIGN KEY (`created_by`) REFERENCES `cimerat` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
