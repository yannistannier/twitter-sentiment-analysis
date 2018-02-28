import json
import tweepy
import os

auth = tweepy.OAuthHandler(os.environ["consumer_key"], os.environ["consumer_secret"])
auth.set_access_token(os.environ["access_token"], os.environ["access_token_secret"])
api = tweepy.API(auth)
     
def lambda_handler(event, context):
    
    user = event["queryStringParameters"]["id"]

    user = api.get_user(user)

    result = {
        "name" : user.name,
    	"screen_name" : user.screen_name,
    	"description" : user.description,
    	"image" : user.profile_image_url_https.replace("normal", "bigger")
    }

    return {
        'statusCode': '200',
        'body': json.dumps(result),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }