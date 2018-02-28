import os
import sys
import re
import datetime
import json
import requests
from pyspark import SparkContext
from pyspark.sql import SparkSession


def transform(lines):
    line = json.loads(lines)
    line["total"] = 1
    res = [
        ("year|"+str(line["user"]), line),
        ("month-"+str(line["month"])+"|"+str(line["user"]), line)
    ]
    return res


def reduce_by_key(value1, value2):
    value1["sentiment"] = [x + y for x, y in zip(value1["sentiment"], value2["sentiment"])]
    value1["emotion"] = [x + y for x, y in zip(value1["emotion"], value2["emotion"])]
    value1["total"] = value1["total"] + value2["total"]
    return value1


def sort_and_count(line):
    newlist = sorted(line[1], key=lambda k: k['total'], reverse=True)
    n = 50 if len(line[0]) == 2 else 50
    rt = [ (line[0], nl) for nl in newlist[0:n] ]
    return rt

def resplit_date(line):
    key = line[0].split("|")
    return (key[0], line[1])

def formatter(line):
    line[1]["key"] = line[0]
    res = {
        "key": line[0],
        "user": line[1]["user"],
        "sentiment": line[1]["sentiment"],
        "emotion": line[1]["emotion"],
        "total": line[1]["total"],
        "month": line[1]["month"],
    }
    return json.dumps(res)


if __name__ == "__main__":

    sc = SparkContext()
    myRDD = sc.textFile("datas/*")
    analyzed = myRDD.flatMap(transform)\
        .reduceByKey(reduce_by_key) \
        .map(resplit_date)\
        .groupByKey() \
        .flatMap(sort_and_count)\
        .map(formatter)

    analyzed.saveAsTextFile("result_best_user/")