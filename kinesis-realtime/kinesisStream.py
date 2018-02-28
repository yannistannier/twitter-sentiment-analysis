import boto3
import time
import json
import re
import os
from sklearn.externals import joblib
from textblob import TextBlob


def clean_text(datas):
    text = get_text(datas)
    tw = ' '.join(re.sub("(@[A-Za-z0-9]+)|([^.'’0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", text).split())
    tw = tw.replace("RT", "")
    tw = re.sub(r"http\S+", "", tw.strip())
    return tw.lower()


def get_text(data):
    if "retweeted_status" in data:
        if data["retweeted_status"]:
            if "extended_tweet" in data["retweeted_status"]:
                return data["retweeted_status"]["extended_tweet"]["full_text"]
            return data["retweeted_status"]["text"]

    if "extended_tweet" in data:
        if data["extended_tweet"]:
            return data["extended_tweet"]["full_text"]
    return data["text"]



def sentiment_analysis(data):
    analysis = TextBlob(data)
    if analysis.sentiment.polarity > 0:
        st = 'positive'
    elif analysis.sentiment.polarity == 0:
        st = 'neutral'
    else:
        st = 'negative'
    return st


kinesis = boto3.client('kinesis',region_name='eu-west-1')
shard_it = kinesis.get_shard_iterator(
    StreamName=os.environ["STREAM_NAME"],
    ShardId="0",
    ShardIteratorType="LATEST")["ShardIterator"]
iot = boto3.client('iot-data',region_name='eu-west-1')

ml = joblib.load("filenameemo.pkl")

while True:
    response = kinesis.get_records(ShardIterator=shard_it,Limit=1000)
    shard_it = response["NextShardIterator"]

    if response["Records"]:
        t=0
        emotions={
            "joy" : 0,
            "fear" : 0,
            "anger" : 0,
            "surprise" : 0,
            "sadness" : 0,
        }
        sentiments={
            "positive":0,
            "neutral" : 0,
            "negative":0
        }
        hashtags = {}
        messages = []
        retweet = 0
        for record in response["Records"]:
            full += 1
            res = json.loads(record["Data"].decode('utf8'))
            text = clean_text(res)
            messages.append(res["text"])
            emo = ml.predict([text])[0]
            sen = sentiment_analysis(text)
            emotions[emo] = emotions[emo]+1
            sentiments[sen] = emotions[emo]+1
            t +=1

            if "RT @" in res["text"]:
                retweet = retweet + 1
            if "entities" in res:
                for v in res["entities"]["hashtags"]:
                    hashtags.setdefault(v["text"],0)
                    hashtags[v["text"]] += 1

        output = {
            "emotions": emotions,
            "sentiments": sentiments,
            "total" : t,
            "retweet" : retweet,
            "hashtags" : hashtags,
            "messages":messages

        }
        iot.publish(
            topic='resultat',
            payload=json.dumps(output)
        )
    if not response["Records"] :
        time.sleep(3)
    else:
        time.sleep(0.2)
