import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Подключение к БД через переменную окружения DATABASE_URL"""
    dsn = os.environ['DATABASE_URL']
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def hash_password(password: str) -> str:
    """Хеширование пароля с солью (ограничено 255 символами)"""
    salt = hashlib.sha256(os.urandom(32)).hexdigest()[:32].encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 50000)
    return (salt + pwdhash).hex()[:255]

def verify_password(stored_password: str, provided_password: str) -> bool:
    """Проверка пароля"""
    salt = bytes.fromhex(stored_password[:64])
    stored_hash = stored_password[64:]
    pwdhash = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt, 50000)
    return pwdhash.hex() == stored_hash

def generate_token() -> str:
    """Генерация токена для сессии"""
    return secrets.token_urlsafe(32)

def handler(event: dict, context) -> dict:
    """
    API для регистрации и авторизации пользователей SPARCOM.
    
    POST /register - регистрация нового пользователя
    POST /login - вход в систему
    POST /logout - выход из системы
    GET /me - получить данные текущего пользователя
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': ''
        }
    
    query_params = event.get('queryStringParameters', {}) or {}
    action = query_params.get('action', '')
    
    try:
        if method == 'POST' and action == 'register':
            return handle_register(event)
        elif method == 'POST' and action == 'login':
            return handle_login(event)
        elif method == 'POST' and action == 'logout':
            return handle_logout(event)
        elif method == 'GET' and action == 'me':
            return handle_get_user(event)
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Action not found. Use ?action=register|login|logout|me'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def handle_register(event: dict) -> dict:
    """Регистрация нового пользователя"""
    data = json.loads(event.get('body', '{}'))
    
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'guest')
    phone = data.get('phone', '')
    
    if not username or not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Username, email и password обязательны'})
        }
    
    if role not in ['guest', 'organizer', 'master']:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Недопустимая роль'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
        if cur.fetchone():
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Пользователь с таким email или username уже существует'})
            }
        
        password_hash = hash_password(password)
        
        cur.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (username, email, password_hash)
        )
        user_id = cur.fetchone()['id']
        
        cur.execute(
            "INSERT INTO user_profiles (user_id, role, phone) VALUES (%s, %s, %s)",
            (user_id, role, phone)
        )
        
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'message': 'Регистрация успешна',
                'user_id': user_id,
                'username': username,
                'role': role
            })
        }
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def handle_login(event: dict) -> dict:
    """Вход в систему"""
    data = json.loads(event.get('body', '{}'))
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email и password обязательны'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """
            SELECT u.id, u.username, u.email, u.password_hash, u.is_active,
                   p.role, p.phone, p.is_verified
            FROM users u
            LEFT JOIN user_profiles p ON u.id = p.user_id
            WHERE u.email = %s
            """,
            (email,)
        )
        user = cur.fetchone()
        
        if not user or not verify_password(user['password_hash'], password):
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный email или пароль'})
            }
        
        if not user['is_active']:
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Аккаунт деактивирован'})
            }
        
        token = generate_token()
        expires_at = datetime.now() + timedelta(days=30)
        
        cur.execute(
            "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user['id'], token, expires_at)
        )
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Set-Cookie': f'sparcom_token={token}; Path=/; Max-Age=2592000; SameSite=Lax'
            },
            'body': json.dumps({
                'message': 'Успешный вход',
                'token': token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'role': user['role'],
                    'is_verified': user['is_verified']
                }
            })
        }
    finally:
        cur.close()
        conn.close()

def handle_logout(event: dict) -> dict:
    """Выход из системы"""
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    
    if not token:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Токен не предоставлен'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("DELETE FROM user_sessions WHERE token = %s", (token,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Set-Cookie': 'sparcom_token=; Path=/; Max-Age=0'
            },
            'body': json.dumps({'message': 'Успешный выход'})
        }
    finally:
        cur.close()
        conn.close()

def handle_get_user(event: dict) -> dict:
    """Получить данные текущего пользователя"""
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Токен не предоставлен'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """
            SELECT u.id, u.username, u.email, u.first_name, u.last_name,
                   p.role, p.phone, p.bio, p.is_verified
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN user_profiles p ON u.id = p.user_id
            WHERE s.token = %s AND s.expires_at > NOW()
            """,
            (token,)
        )
        user = cur.fetchone()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Недействительный или истекший токен'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'user': dict(user)})
        }
    finally:
        cur.close()
        conn.close()