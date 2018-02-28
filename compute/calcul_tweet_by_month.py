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

    return ("month-"+str(line["month"])+"|day-"+str(line["day"]), line)


def reduce_by_key(value1, value2):
    res = value1
    res["sentiment"] = [x + y for x, y in zip(value1["sentiment"], value2["sentiment"])]
    res["emotion"] = [x + y for x, y in zip(value1["emotion"], value2["emotion"])]
    res["total"] = value1["total"] + value2["total"]
    return res


def formatter(line):
    res = {
        "key": line[0],
        "sentiment": line[1]["sentiment"],
        "emotion": line[1]["emotion"],
        "total": line[1]["total"],
        "month": line[1]["month"],
        "day": line[1]["day"]
    }
    return json.dumps(res)


if __name__ == "__main__":

    sc = SparkContext()

    myRDD = sc.textFile("datas/*")
    analyzed = myRDD.map(transform)\
        .reduceByKey(reduce_by_key)\
        .map(formatter)

    analyzed.saveAsTextFile("result_calcul_by_month/")

