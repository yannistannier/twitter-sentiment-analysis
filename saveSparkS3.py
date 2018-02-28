import psycopg2
import boto3
import json
import time
import os

host = os.environ["HOST"]
database = os.environ["DATABASE"]
user = os.environ["USER"]
password = os.environ["PASSWORD"]
port = os.environ["PORT"]

def lambda_handler(event, context):
    s3 = boto3.resource('s3')
    
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        try:
            obj = s3.Object(bucket, key)
            content = obj.get()['Body'].read()
        except Exception, e:
            continue
        
        results = []
        
        contentline = content.split("\n")
        for line in contentline:
            if not line :
                continue
            data = json.loads(line)
            results.append(data)
            
        conn = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
        cur = conn.cursor()


        datas = ','.join(
            cur.mogrify(
                "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (row["id"], row["hashtag"].lower(), row["emotion"], row["sentiment"], row["year"], row["month"], row["day"], row["hour"], row["retweet"], row["user"] )) for row in results)

        cur.execute('insert into trends (id_tweet, hashtag, emotion, sentiment, date_year, date_month, date_day, date_hour, retweet, author) values ' + datas + ' ON CONFLICT (id_tweet, hashtag) DO NOTHING ')
        conn.commit()
        conn.close()
