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

    conn = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # code ....

 
    return None