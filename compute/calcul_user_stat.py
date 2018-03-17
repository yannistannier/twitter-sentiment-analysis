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

    return (str(line["user"])+"|"+str(line["month"]), line)


def reduce_by_key(value1, value2):
    res = value1
    res["sentiment"] = [x + y for x, y in zip(value1["sentiment"], value2["sentiment"])]
    res["emotion"] = [x + y for x, y in zip(value1["emotion"], value2["emotion"])]
    res["total"] = value1["total"] + value2["total"]
    return res


def formatter(line):
    res = {
        "key": line[0],
        "user" : line[1]["user"],
        "sentiment": line[1]["sentiment"],
        "emotion": line[1]["emotion"],
        "total": line[1]["total"],
        "month": line[1]["month"]
    }
    return json.dumps(res)


if __name__ == "__main__":

    sc = SparkContext()
    #sc._jsc.hadoopConfiguration().set("fs.s3a.impl", "org.apache.hadoop.fs.s3native.NativeS3FileSystem")
    #sc.setSystemProperty("com.amazonaws.services.s3.enableV4", "true")
    #sc._jsc.hadoopConfiguration().set("com.amazonaws.services.s3.enableV4", "true")
    sc._jsc.hadoopConfiguration().set("mapreduce.fileoutputcommitter.algorithm.version", "2")
    sc._jsc.hadoopConfiguration().set("speculation", "false")
    #sc._jsc.hadoopConfiguration().set("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    #sc._jsc.hadoopConfiguration().set("fs.s3a.fast.upload", "true")
    #sc._jsc.hadoopConfiguration().set("fs.s3a.endpoint", "s3-eu-central-1.amazonaws.com")

    #sc._jsc.hadoopConfiguration().set("fs.s3a.access.key", "AKIAIUDDVPY5FDRTQX7A")
    #sc._jsc.hadoopConfiguration().set("fs.s3a.secret.key", "dktW4fBxmaXtsw9c26mF1h5A6bYqokDFvLwMSq1S")


    #dd = "2017/01/01"
    #dd = sys.argv[1]
    #ddf = sys.argv[2]
    #myRDD = sc.textFile("data/sample.json")
    # myRDD = sc.textFile("s3a://descartes-bdd/nohashtag/*")
    myRDD = sc.textFile("/media/mbenhamd/A8547F8A547F5A50/Twitter/nohashtag/*")
   
    analyzed = myRDD.map(transform)\
        .reduceByKey(reduce_by_key)\
        .map(formatter)

    #analyzed.saveAsTextFile("result_calcul_by_month/")
    analyzed.saveAsTextFile("/media/mbenhamd/1584A60804F0023E/Twitter/result_user_stat/")

    # with open('calcul/all/test.json', 'w') as outfile:
    #     for d in datas:
    #         outfile.write(d+"\n")
