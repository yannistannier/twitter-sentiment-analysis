import os
import sys
import re
import datetime
import json
import requests
from pyspark import SparkContext
from pyspark.sql import SparkSession


def ct(t):
    if int(t) < 10:
        return "0"+str(t)
    else:
        return str(t)

def transform(line):
    line = json.loads(line)
    if line["sentiment"] == "positive" :
        line["sentiment"] = [1,0,0]
    if line["sentiment"] == "negative" :
        line["sentiment"] = [0,0,1]
    if line["sentiment"] == "neutral" :
        line["sentiment"] = [0,1,0]

    if line["emotion"] == "joy" :
        line["emotion"] = [1,0,0,0,0]
    if line["emotion"] == "fear" :
        line["emotion"] = [0,1,0,0,0]
    if line["emotion"] == "anger" :
        line["emotion"] = [0,0,1,0,0]
    if line["emotion"] == "surprise" :
        line["emotion"] = [0,0,0,1,0]
    if line["emotion"] == "sadness" :
        line["emotion"] = [0,0,0,0,1]

    line["total"] = 1

    return line

def split_into_date(line):
    key1 = ct(line["month"])+"|"+str(line["hashtag"]).lower()
    key2 = ct(line["month"])+"-"+ct(line["day"])+"|"+str(line["hashtag"]).lower()
    key3 = ct(line["month"])+"-"+ct(line["day"])+"-"+ct(line["hour"])+"|"+str(line["hashtag"]).lower()

    return [ (key1, line), (key2, line), (key3, line) ]

def reduce_by_key(value1, value2):
    value1["hashtag"] = value1["hashtag"]
    value1["sentiment"] = [x + y for x, y in zip(value1["sentiment"], value2["sentiment"])]
    value1["emotion"] = [x + y for x, y in zip(value1["emotion"], value2["emotion"])]
    value1["total"] = value1["total"] + value2["total"]
    return value1


def resplit_date(line):
    key = line[0].split("|")
    return (key[0], line[1])


def sort_and_count(line):
    newlist = sorted(line[1], key=lambda k: k['total'], reverse=True)
    n = 40
    rt = [ (line[0], nl) for nl in newlist[0:n] ]
    return rt

def formatter(line):
    res = {
        "id" : int(line[0].replace("-", "")),
        "hashtag": line[1]["hashtag"],
        "total" : line[1]["total"],
        "sentiment" : line[1]["sentiment"],
        "emotion" : line[1]["emotion"],
        "month" : line[1]["month"],
        "day" : line[1]["day"],
        "hour" : line[1]["hour"],
    }
    return json.dumps(res)


if __name__ == "__main__":

    sc = SparkContext()
    myRDD = sc.textFile("data/archive-tweet-hastag/*")
    analyzed = myRDD.map(transform)\
        .filter(lambda line: re.match("[a-zA-Z0-9-_]",line["hashtag"]) )\
        .flatMap(split_into_date)\
        .reduceByKey(reduce_by_key)\
        .map(resplit_date)\
        .groupByKey()\
        .flatMap(sort_and_count)\
        .map(formatter)

    analyzed.saveAsTextFile("result_hashtag_by_month_day/")
