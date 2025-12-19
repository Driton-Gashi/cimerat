CREATE TABLE cimerat (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   lastname VARCHAR(100) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   phone VARCHAR(20)
);


CREATE TABLE payments (
   id INT AUTO_INCREMENT PRIMARY KEY,
   category ENUM('Personal', 'Product', 'Bills') NOT NULL DEFAULT 'Personal',
   name VARCHAR(50) NOT NULL,
   transaction_date DATE NOT NULL,
   payer_id INT NOT NULL,
   amount INT NOT NULL,
   status ENUM('paid', 'unpaid') NOT NULL DEFAULT 'unpaid',

   CONSTRAINT fk_payments_user
      FOREIGN KEY (payer_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);

