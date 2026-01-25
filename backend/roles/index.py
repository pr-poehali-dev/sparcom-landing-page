import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления ролями пользователей и заявками на новые роли'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    action = event.get('queryStringParameters', {}).get('action', 'list')
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    
    if not token and action != 'list':
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'error': 'Требуется авторизация'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if action == 'apply':
            body = json.loads(event.get('body', '{}'))
            requested_role = body.get('requested_role')
            motivation = body.get('motivation')
            portfolio_url = body.get('portfolio_url')
            
            if requested_role not in ['organizer', 'master']:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Некорректная роль'}),
                    'isBase64Encoded': False
                }
            
            if not motivation or len(motivation.strip()) < 50:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Мотивация должна содержать минимум 50 символов'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT user_id FROM user_sessions WHERE token = %s", (token,))
            session = cur.fetchone()
            
            if not session:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Недействительный токен'}),
                    'isBase64Encoded': False
                }
            
            user_id = session[0]
            
            cur.execute(
                "SELECT id FROM role_applications WHERE user_id = %s AND app_status = 'pending'",
                (user_id,)
            )
            existing = cur.fetchone()
            
            if existing:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'У вас уже есть заявка на рассмотрении'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """INSERT INTO role_applications 
                   (user_id, requested_role, motivation, portfolio_url, app_status, created_at)
                   VALUES (%s, %s, %s, %s, 'pending', %s)
                   RETURNING id""",
                (user_id, requested_role, motivation, portfolio_url, datetime.utcnow())
            )
            application_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'application_id': application_id,
                    'message': 'Заявка отправлена на рассмотрение'
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'my':
            cur.execute("SELECT user_id FROM user_sessions WHERE token = %s", (token,))
            session = cur.fetchone()
            
            if not session:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Недействительный токен'}),
                    'isBase64Encoded': False
                }
            
            user_id = session[0]
            
            cur.execute(
                """SELECT id, requested_role, app_status, motivation, portfolio_url, 
                          created_at, reviewed_at, reviewer_comment
                   FROM role_applications 
                   WHERE user_id = %s 
                   ORDER BY created_at DESC""",
                (user_id,)
            )
            
            applications = []
            for row in cur.fetchall():
                applications.append({
                    'id': row[0],
                    'requested_role': row[1],
                    'status': row[2],
                    'motivation': row[3],
                    'portfolio_url': row[4],
                    'created_at': row[5].isoformat() if row[5] else None,
                    'reviewed_at': row[6].isoformat() if row[6] else None,
                    'reviewer_comment': row[7]
                })
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'applications': applications}),
                'isBase64Encoded': False
            }
        
        elif action == 'list':
            cur.execute(
                """SELECT ra.id, ra.user_id, u.username, u.email, ra.requested_role, 
                          ra.app_status, ra.created_at
                   FROM role_applications ra
                   JOIN users u ON ra.user_id = u.id
                   WHERE ra.app_status = 'pending'
                   ORDER BY ra.created_at ASC"""
            )
            
            applications = []
            for row in cur.fetchall():
                applications.append({
                    'id': row[0],
                    'user_id': row[1],
                    'username': row[2],
                    'email': row[3],
                    'requested_role': row[4],
                    'status': row[5],
                    'created_at': row[6].isoformat() if row[6] else None
                })
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'applications': applications}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Неизвестное действие'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()