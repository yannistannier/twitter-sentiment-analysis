import tweepy
import boto3
import time
import json
import os
import hashlib
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient


class MyStreamListener(tweepy.StreamListener):
    def __init__(self, time_limit=60):
        self.tt = 0
        super(MyStreamListener, self).__init__()

    def on_status(self, status):
        self.tt = self.tt + 1
        kinesis.put_record(
            StreamName=os.environ["STREAM_NAME"],
            Data=json.dumps({
                "id_str" : status.id_str,
                "text" : status.text,
                "entities" : status.entities,
                "extended_tweet" : status.extended_tweet if status.truncated else None,
                "retweeted_status" : status.retweeted_status if status.retweeted else None,
            }),
            PartitionKey="1"
        )


def localisationCallback(client, userdata, message):
    msg = json.loads(message.payload.decode("utf-8") )
    if "action" in msg:
        if msg["action"] == "STOP" :
            myStream.disconnect()
        if msg["action"] == "GO" :
            myStream.disconnect()
            myStream.filter(track=[ msg["filter"] ], languages=["en"], async=True)


kinesis = boto3.client('kinesis', region_name='eu-west-1')

auth = tweepy.OAuthHandler(os.environ["CONSUMER_KEY"], os.environ["CONSUMER_SECRET"])
auth.set_access_token(os.environ["ACCESS_TOKEN"],os.environ["ACCESS_SECRET_TOKEN"])
api = tweepy.API(auth)
myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth, listener=myStreamListener, timeout=1000)


myMQTTClient = AWSIoTMQTTClient("twitter")
myMQTTClient.configureEndpoint(os.environ["ENDPOINT"], 8883)
myMQTTClient.configureCredentials("root-CA.crt", "private.pem.key", "certificate.pem.crt")

myMQTTClient.connect()
myMQTTClient.subscribe(os.environ["STREAM"], 1, localisationCallback)


while True:
    time.sleep(60)
    # myStream.disconnect()