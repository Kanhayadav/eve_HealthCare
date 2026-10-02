-- CENTRES
INSERT INTO centres (name, location) VALUES
('Apollo Diagnostics', 'South Delhi'),
('Dr Lal PathLabs', 'Gurugram'),
('Max Lab', 'Noida'),
('Metropolis Healthcare', 'Delhi'),
('Thyrocare', 'Gurugram'),
('SRL Diagnostics', 'Faridabad'),
('Redcliffe Labs', 'Noida'),
('Healthians', 'Delhi'),
('Pathkind Labs', 'Gurugram'),
('Suburban Diagnostics', 'Delhi');


-- TESTS
INSERT INTO tests (name) VALUES
('Complete Blood Count'),
('Lipid Profile'),
('Liver Function Test'),
('Kidney Function Test'),
('Thyroid Profile'),
('HbA1c'),
('Blood Glucose'),
('Vitamin D'),
('Vitamin B12'),
('Urine Routine');


-- CENTRE ↔ TESTS
INSERT INTO centre_tests (centre_id, test_id, price) VALUES

-- Apollo Diagnostics
(1, 1, 500.00),
(1, 2, 800.00),
(1, 3, 900.00),
(1, 5, 700.00),
(1, 6, 600.00),

-- Dr Lal PathLabs
(2, 1, 450.00),
(2, 2, 750.00),
(2, 4, 850.00),
(2, 6, 550.00),
(2, 8, 1200.00),

-- Max Lab
(3, 1, 550.00),
(3, 3, 950.00),
(3, 5, 650.00),
(3, 7, 300.00),
(3, 9, 1000.00),

-- Metropolis
(4, 1, 480.00),
(4, 2, 780.00),
(4, 4, 900.00),
(4, 8, 1100.00),
(4, 10, 250.00),

-- Thyrocare
(5, 1, 400.00),
(5, 2, 700.00),
(5, 5, 600.00),
(5, 6, 500.00),
(5, 8, 1000.00),

-- SRL Diagnostics
(6, 1, 520.00),
(6, 3, 880.00),
(6, 4, 820.00),
(6, 7, 280.00),
(6, 9, 950.00),

-- Redcliffe Labs
(7, 1, 430.00),
(7, 2, 720.00),
(7, 5, 580.00),
(7, 6, 520.00),
(7, 10, 220.00),

-- Healthians
(8, 1, 420.00),
(8, 3, 850.00),
(8, 4, 800.00),
(8, 8, 1050.00),
(8, 9, 900.00),

-- Pathkind Labs
(9, 1, 460.00),
(9, 2, 740.00),
(9, 5, 620.00),
(9, 7, 270.00),
(9, 10, 230.00),

-- Suburban Diagnostics
(10, 1, 490.00),
(10, 3, 920.00),
(10, 4, 870.00),
(10, 6, 570.00),
(10, 8, 1150.00);



INSERT INTO bookings
(user_id, test_id, centre_id, appointment, amount, status)
VALUES
(1, 1, 1, '2026-10-10 10:00:00', 500.00, 'PENDING'),
(1, 2, 1, '2026-10-11 11:00:00', 800.00, 'CONFIRMED'),
(1, 3, 1, '2026-10-12 09:30:00', 900.00, 'FAILED'),

(1, 1, 2, '2026-10-13 10:00:00', 450.00, 'PENDING'),
(1, 4, 2, '2026-10-14 14:00:00', 850.00, 'CONFIRMED'),

(1, 1, 3, '2026-10-15 09:00:00', 550.00, 'PENDING'),
(1, 5, 3, '2026-10-16 12:00:00', 580.00, 'CONFIRMED'),

(1, 1, 4, '2026-10-17 10:30:00', 480.00, 'FAILED'),
(1, 8, 4, '2026-10-18 11:30:00', 1100.00, 'PENDING'),

(1, 1, 5, '2026-10-19 09:00:00', 400.00, 'CONFIRMED');