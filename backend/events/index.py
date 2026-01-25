import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления банными событиями и встречами'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if action == 'list':
            status_filter = event.get('queryStringParameters', {}).get('status', 'published')
            
            cur.execute(
                """SELECT id, title, description, bathhouse_id, master_id, organizer_id,
                          event_date, duration_hours, max_participants, current_participants,
                          price_per_person, event_status, created_at
                   FROM events
                   WHERE event_status = %s OR %s = 'all'
                   ORDER BY event_date ASC""",
                (status_filter, status_filter)
            )
            
            events = []
            for row in cur.fetchall():
                events.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'bathhouse_id': row[3],
                    'master_id': row[4],
                    'organizer_id': row[5],
                    'event_date': row[6].isoformat() if row[6] else None,
                    'duration_hours': row[7],
                    'max_participants': row[8],
                    'current_participants': row[9],
                    'price_per_person': row[10],
                    'status': row[11],
                    'created_at': row[12].isoformat() if row[12] else None
                })
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'events': events}),
                'isBase64Encoded': False
            }
        
        elif action == 'get':
            event_id = event.get('queryStringParameters', {}).get('id')
            
            if not event_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Не указан ID события'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """SELECT id, title, description, bathhouse_id, master_id, organizer_id,
                          event_date, duration_hours, max_participants, current_participants,
                          price_per_person, event_status, created_at
                   FROM events
                   WHERE id = %s""",
                (event_id,)
            )
            
            row = cur.fetchone()
            
            if not row:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Событие не найдено'}),
                    'isBase64Encoded': False
                }
            
            event_data = {
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'bathhouse_id': row[3],
                'master_id': row[4],
                'organizer_id': row[5],
                'event_date': row[6].isoformat() if row[6] else None,
                'duration_hours': row[7],
                'max_participants': row[8],
                'current_participants': row[9],
                'price_per_person': row[10],
                'status': row[11],
                'created_at': row[12].isoformat() if row[12] else None
            }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'event': event_data}),
                'isBase64Encoded': False
            }
        
        elif action == 'create':
            token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Требуется авторизация'}),
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
            
            cur.execute("SELECT user_role FROM user_profiles WHERE user_id = %s", (user_id,))
            profile = cur.fetchone()
            
            if not profile or profile[0] not in ['organizer', 'master']:
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps({'error': 'Только организаторы могут создавать события'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            
            title = body.get('title')
            description = body.get('description')
            bathhouse_id = body.get('bathhouse_id')
            event_date = body.get('event_date')
            duration_hours = body.get('duration_hours', 2)
            max_participants = body.get('max_participants', 10)
            price_per_person = body.get('price_per_person')
            
            if not all([title, description, event_date, price_per_person]):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Не заполнены обязательные поля'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """INSERT INTO events 
                   (title, description, bathhouse_id, organizer_id, event_date, 
                    duration_hours, max_participants, current_participants, 
                    price_per_person, event_status, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, 0, %s, 'draft', %s)
                   RETURNING id""",
                (title, description, bathhouse_id, user_id, event_date, 
                 duration_hours, max_participants, price_per_person, datetime.utcnow())
            )
            
            event_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'event_id': event_id,
                    'message': 'Событие создано'
                }),
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