from psycopg2.extras import RealDictCursor
import psycopg2
import json
import os
import hashlib

host = os.environ["HOST"]
database = os.environ["DATABASE"]
user = os.environ["USER"]
password = os.environ["PASSWORD"]
port = os.environ["PORT"]
     
def lambda_handler(event, context):

    id = event["queryStringParameters"]["id"]
    hash = hashlib.md5(id.encode('utf-8')).hexdigest()
    
    conn = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('SELECT * FROM "user_stat" WHERE id=%s', (hash,))
    stats = cur.fetchall()
    
    cur.execute('SELECT * FROM "summary_user_hashtag" WHERE id=%s', (hash,))
    hashtags = cur.fetchall()
    
    cur.execute('SELECT * FROM "user_total" WHERE id=%s', (hash,))
    tweets = cur.fetchone()
    
    cur.execute('SELECT total FROM "retweet_total" WHERE id=%s', (hash,))
    retweets = cur.fetchone()
    
    result={
        "stat":stats,
        "hashtags":hashtags,
        "tweets" : tweets,
        "retweets" : retweets
    }
 
    return {
        'statusCode': '200',
        'body': json.dumps(result),
        'headers': {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
        }
    }