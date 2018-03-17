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
    return line


def reduce_by_key(value1, value2):
    res = value1
    res["sentiment"] = [x + y for x, y in zip(value1["sentiment"], value2["sentiment"])]
    res["emotion"] = [x + y for x, y in zip(value1["emotion"], value2["emotion"])]
    res["total"] = value1["total"] + value2["total"]
    return res


def sort_and_count(line):
    newlist = sorted(line[1], key=lambda k: k['total'], reverse=True)
    n = 50 if len(line[0]) == 2 else 50
    rt = [(line[0], nl) for nl in newlist[0:n]]
    return rt


def resplit_date(line):
    key = line[0].split("|")
    return key[0], line[1]


def formatter(line):
    line[1]["key"] = line[0]
    return json.dumps(line[1])


if __name__ == "__main__":
    sc = SparkContext()
    # sc._jsc.hadoopConfiguration().set("fs.s3a.impl", "org.apache.hadoop.fs.s3native.NativeS3FileSystem")
    # sc.setSystemProperty("com.amazonaws.services.s3.enableV4", "true")
    # sc._jsc.hadoopConfiguration().set("com.amazonaws.services.s3.enableV4", "true")
    sc._jsc.hadoopConfiguration().set("mapreduce.fileoutputcommitter.algorithm.version", "2")
    sc._jsc.hadoopConfiguration().set("speculation", "false")
    # sc._jsc.hadoopConfiguration().set("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    # sc._jsc.hadoopConfiguration().set("fs.s3a.fast.upload", "true")
    # sc._jsc.hadoopConfiguration().set("fs.s3a.endpoint", "s3-eu-central-1.amazonaws.com")

    # sc._jsc.hadoopConfiguration().set("fs.s3a.access.key", "AKIAIUDDVPY5FDRTQX7A")
    # sc._jsc.hadoopConfiguration().set("fs.s3a.secret.key", "dktW4fBxmaXtsw9c26mF1h5A6bYqokDFvLwMSq1S")

    # dd = "2017/01/01"
    # dd = sys.argv[1]
    # ddf = sys.argv[2]
    # myRDD = sc.textFile("data/sample.json")
    # numPartitions=5000
    myRDD = sc.textFile("/media/mbenhamd/ssd/Twitter/nohashtag/01.json")

    analyzed = myRDD.flatMap(transform) \
        .reduceByKey(reduce_by_key) \
        .map(resplit_date) \
        # .groupByKey() \
        # .flatMap(sort_and_count)\
        # .map(formatter)\


    analyzed.saveAsTextFile(/media/mbenhamd/hdd/Twitter)

    # with open('calcul/all/test.json', 'w') as outfile:
    #     for d in datas:
    #         outfile.write(d+"\n")
