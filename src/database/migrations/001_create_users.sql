-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear un índice en el email para mejor rendimiento en búsquedas
CREATE INDEX idx_users_email ON users(email);

-- Insertar un usuario admin inicial
INSERT INTO users (email, password_hash, role)
VALUES (
    'admin@accesoit.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4V87jt2PSwsWpWzWZrB4j3hj553sX.L' -- contraseña: password123
    'admin'
) ON CONFLICT DO NOTHING;
