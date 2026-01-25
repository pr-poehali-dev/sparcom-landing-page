-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Профили пользователей с ролями
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    user_role VARCHAR(50) DEFAULT 'guest',
    phone VARCHAR(20),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_role CHECK (user_role IN ('guest', 'organizer', 'master', 'admin'))
);

-- Сессии пользователей (токены)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_user_session FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Заявки на роли
CREATE TABLE IF NOT EXISTS role_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    requested_role VARCHAR(50) NOT NULL,
    motivation TEXT NOT NULL,
    portfolio_url TEXT,
    app_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewer_id INTEGER,
    reviewer_comment TEXT,
    CONSTRAINT fk_applicant FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id),
    CONSTRAINT chk_requested_role CHECK (requested_role IN ('organizer', 'master')),
    CONSTRAINT chk_app_status CHECK (app_status IN ('pending', 'approved', 'rejected'))
);

-- Бани / пространства
CREATE TABLE IF NOT EXISTS bathhouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    photos TEXT[],
    capacity INTEGER DEFAULT 10,
    price_per_hour INTEGER DEFAULT 0,
    amenities TEXT[],
    owner_id INTEGER NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Мастера (расширенная информация для роли master)
CREATE TABLE IF NOT EXISTS masters (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    specialization TEXT[],
    experience_years INTEGER DEFAULT 0,
    bio TEXT,
    portfolio_photos TEXT[],
    rating DECIMAL(3, 2) DEFAULT 0.00,
    reviews_count INTEGER DEFAULT 0,
    price_per_session INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_master_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- События / встречи
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    bathhouse_id INTEGER,
    master_id INTEGER,
    organizer_id INTEGER NOT NULL,
    event_date TIMESTAMP NOT NULL,
    duration_hours INTEGER DEFAULT 2,
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,
    price_per_person INTEGER NOT NULL,
    event_status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bathhouse FOREIGN KEY (bathhouse_id) REFERENCES bathhouses(id),
    CONSTRAINT fk_master FOREIGN KEY (master_id) REFERENCES masters(id),
    CONSTRAINT fk_organizer FOREIGN KEY (organizer_id) REFERENCES users(id),
    CONSTRAINT chk_event_status CHECK (event_status IN ('draft', 'published', 'full', 'ongoing', 'completed', 'cancelled'))
);

-- Бронирования
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    total_price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_booking_status CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    UNIQUE(event_id, user_id)
);

-- Платежи
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT chk_payment_status_pay CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded'))
);

-- Отзывы
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5),
    UNIQUE(event_id, user_id)
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(event_status);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings(event_id);
