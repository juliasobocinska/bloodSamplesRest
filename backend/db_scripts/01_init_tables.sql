-- 1. Tabela Użytkowników
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'patient', -- Rola (domyślnie pacjent)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela Zamówień (Orders)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sample_type TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    age INTEGER,
    quantity INTEGER DEFAULT 1,
    address TEXT
);

-- 3. Tabela Wyników (Results)
CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    test_name VARCHAR(50),
    description TEXT,
    test_value DECIMAL,
    file_url VARCHAR(255), -- link do pliku z wynikiem, jeśli będzie taka funkcja
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    payu_id text,
    price INTEGER,
    description TEXT,
    status VARCHAR(255)
);


