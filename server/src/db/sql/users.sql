CREATE TABLE
    IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        userType VARCHAR(20) NOT NULL CHECK (userType IN ('admin', 'user')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );