-- Добавляем поля для Telegram авторизации
ALTER TABLE t_p33228717_sparcom_landing_page.users 
ADD COLUMN IF NOT EXISTS telegram_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- Индекс для быстрого поиска по telegram_id
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON t_p33228717_sparcom_landing_page.users(telegram_id);

-- Создаем таблицу для временных токенов Telegram авторизации
CREATE TABLE IF NOT EXISTS t_p33228717_sparcom_landing_page.telegram_auth_tokens (
    id SERIAL PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    telegram_id VARCHAR(50) NOT NULL,
    telegram_username VARCHAR(255),
    telegram_first_name VARCHAR(255),
    telegram_last_name VARCHAR(255),
    telegram_photo_url TEXT,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telegram_auth_tokens_token_hash 
ON t_p33228717_sparcom_landing_page.telegram_auth_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_telegram_auth_tokens_expires_at 
ON t_p33228717_sparcom_landing_page.telegram_auth_tokens(expires_at);

-- Создаем таблицу для refresh токенов
CREATE TABLE IF NOT EXISTS t_p33228717_sparcom_landing_page.refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p33228717_sparcom_landing_page.users(id),
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id 
ON t_p33228717_sparcom_landing_page.refresh_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash 
ON t_p33228717_sparcom_landing_page.refresh_tokens(token_hash);