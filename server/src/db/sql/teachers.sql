CREATE TABLE
    IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        department VARCHAR(100) NOT NULL,
        salary NUMERIC(10, 2) NOT NULL,
        mobile VARCHAR(20) NOT NULL UNIQUE,
        created_by INTEGER REFERENCES users (id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )