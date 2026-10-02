CREATE TYPE booking_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'FAILED',
    'CANCELLED'
);

CREATE TYPE payment_status AS ENUM (
    'SUCCESS',
    'FAILED'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE centres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE centre_tests (
    centre_id INTEGER NOT NULL,
    test_id INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),

    PRIMARY KEY (centre_id, test_id),

    FOREIGN KEY (centre_id)
        REFERENCES centres(id)
        ON DELETE CASCADE,

    FOREIGN KEY (test_id)
        REFERENCES tests(id)
        ON DELETE CASCADE
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    test_id INTEGER NOT NULL,
    centre_id INTEGER NOT NULL,

    appointment TIMESTAMP NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),

    status booking_status NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (test_id)
        REFERENCES tests(id),

    FOREIGN KEY (centre_id)
        REFERENCES centres(id)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,

    booking_id INTEGER NOT NULL,
    event_id VARCHAR(255) UNIQUE NOT NULL,

    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),

    status payment_status NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
);