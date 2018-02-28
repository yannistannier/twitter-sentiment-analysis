from psycopg2.extras import RealDictCursor
import psycopg2
import json
import os

host = os.environ["HOST"]
database = os.environ["DATABASE"]
user = os.environ["USER"]
password = os.environ["PASSWORD"]
port = os.environ["PORT"]
     
def lambda_handler(event, context):

    id = event["queryStringParameters"]["id"]
    conn = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT * FROM "summary_tweet_by_month" WHERE month=%s ORDER BY day', (id,))

 
    return {
        'statusCode': '200',
        'body': json.dumps(cur.fetchall()),
        'headers': {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
        }
    }