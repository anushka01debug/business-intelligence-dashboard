-- ============================================
-- SAMPLE BUSINESS DATA
-- ============================================

-- CUSTOMERS
INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Aarav Sharma', 'aarav@example.com', 'Delhi', 'North', 'Returning', DATE '2025-01-15');

INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Priya Mehta', 'priya@example.com', 'Mumbai', 'West', 'New', DATE '2025-02-20');

INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Rohan Gupta', 'rohan@example.com', 'Bangalore', 'South', 'Returning', DATE '2025-03-10');

INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Ananya Singh', 'ananya@example.com', 'Kolkata', 'East', 'New', DATE '2025-04-05');

INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Kabir Verma', 'kabir@example.com', 'Pune', 'West', 'Returning', DATE '2025-05-12');

INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Ishita Rao', 'ishita@example.com', 'Chennai', 'South', 'New', DATE '2025-06-18');

INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Vihaan Kapoor', 'vihaan@example.com', 'Jaipur', 'North', 'Returning', DATE '2025-07-22');

INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Sara Khan', 'sara@example.com', 'Hyderabad', 'South', 'New', DATE '2025-08-14');

INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Aditya Nair', 'aditya@example.com', 'Kochi', 'South', 'Returning', DATE '2025-09-01');

INSERT INTO customers
(customer_name, email, city, region, customer_type, registration_date)
VALUES
('Meera Joshi', 'meera@example.com', 'Ahmedabad', 'West', 'New', DATE '2025-10-11');


-- PRODUCTS
INSERT INTO products
(product_name, category, unit_price, cost_price)
VALUES
('Laptop Pro 14', 'Electronics', 85000, 68000);

INSERT INTO products
(product_name, category, unit_price, cost_price)
VALUES
('Wireless Headphones', 'Electronics', 4500, 2800);

INSERT INTO products
(product_name, category, unit_price, cost_price)
VALUES
('Office Chair', 'Furniture', 12000, 7500);

INSERT INTO products
(product_name, category, unit_price, cost_price)
VALUES
('Mechanical Keyboard', 'Accessories', 6500, 4000);

INSERT INTO products
(product_name, category, unit_price, cost_price)
VALUES
('Smart Monitor 27', 'Electronics', 28000, 21000);

INSERT INTO products
(product_name, category, unit_price, cost_price)
VALUES
('Desk Lamp', 'Furniture', 2200, 1200);

INSERT INTO products
(product_name, category, unit_price, cost_price)
VALUES
('USB-C Hub', 'Accessories', 3500, 2100);

INSERT INTO products
(product_name, category, unit_price, cost_price)
VALUES
('Web Camera', 'Electronics', 5500, 3500);


-- ORDERS
INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(1, DATE '2026-01-05', 'Completed', 'UPI');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(2, DATE '2026-01-18', 'Completed', 'Card');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(3, DATE '2026-02-07', 'Completed', 'UPI');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(4, DATE '2026-02-21', 'Completed', 'Card');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(5, DATE '2026-03-03', 'Completed', 'Net Banking');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(6, DATE '2026-03-19', 'Completed', 'UPI');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(7, DATE '2026-04-04', 'Completed', 'Card');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(8, DATE '2026-04-25', 'Completed', 'UPI');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(9, DATE '2026-05-08', 'Completed', 'Card');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(10, DATE '2026-05-23', 'Completed', 'UPI');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(1, DATE '2026-06-06', 'Completed', 'Card');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(2, DATE '2026-06-17', 'Completed', 'UPI');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(3, DATE '2026-07-02', 'Completed', 'Card');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(4, DATE '2026-07-21', 'Completed', 'UPI');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(5, DATE '2026-08-03', 'Completed', 'Card');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(6, DATE '2026-08-19', 'Completed', 'UPI');

INSERT INTO orders
(customer_id, order_date, order_status, payment_method)
VALUES
(7, DATE '2026-09-02', 'Completed', 'Card');


-- ORDER ITEMS

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(1, 1, 1, 85000);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(1, 2, 2, 4500);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(2, 3, 1, 12000);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(2, 6, 2, 2200);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(3, 5, 1, 28000);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(4, 4, 2, 6500);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(5, 1, 1, 85000);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(6, 7, 2, 3500);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(7, 8, 2, 5500);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(8, 2, 3, 4500);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(9, 3, 2, 12000);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(10, 5, 1, 28000);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(11, 1, 1, 85000);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(12, 7, 3, 3500);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(13, 4, 1, 6500);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(14, 8, 2, 5500);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(15, 6, 4, 2200);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(16, 5, 2, 28000);

INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES
(17, 1, 1, 85000);


COMMIT;


-- VERIFY DATA
SELECT COUNT(*) AS total_customers FROM customers;

SELECT COUNT(*) AS total_products FROM products;

SELECT COUNT(*) AS total_orders FROM orders;

SELECT COUNT(*) AS total_order_items FROM order_items;