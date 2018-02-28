import os
import sys
import re
import datetime
import json
import requests
from pyspark import SparkContext
from pyspark.sql import SparkSession


def transform(line):
    line = json.loads(line)
    line["total"] = 1

    res = [
        ("month-"+str(line["month"]), line),
        ("hour-"+str(line["hour"]), line)
    ]
    return res


def reduce_by_key(value1, value2):
    res = value1
    res["sentiment"] = [x + y for x, y in zip(value1["sentiment"], value2["sentiment"])]
    res["emotion"] = [x + y for x, y in zip(value1["emotion"], value2["emotion"])]
    res["total"] = value1["total"] + value2["total"]
    return res


def formatter(line):
    line[1]["key"] = line[0]
    return json.dumps(line[1])


if __name__ == "__main__":

    sc = SparkContext()
    myRDD = sc.textFile("datas/*")
    analyzed = myRDD.flatMap(transform)\
        .reduceByKey(reduce_by_key)\
        .map(formatter)
    analyzed.saveAsTextFile("result_calcul_year_tweet_month/")

