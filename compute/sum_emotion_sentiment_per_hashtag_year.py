import json
from pyspark import SparkContext
from pyspark.sql import SparkSession
from pyspark.sql.functions import array, col
from pyspark.sql.functions import desc
from pyspark.sql.functions import sum as somme
from pyspark.sql.functions import udf
from pyspark.sql.types import IntegerType


def transform(line):
    line = json.load(line)
    if line["sentiment"] == "positive":
        line["sentiment"] = [1, 0, 0]
    if line["sentiment"] == "negative":
        line["sentiment"] = [0, 0, 1]
    if line["sentiment"] == "neutral":
        line["sentiment"] = [0, 1, 0]

    if line["emotion"] == "joy":
        line["emotion"] = [1, 0, 0, 0, 0]
    if line["emotion"] == "fear":
        line["emotion"] = [0, 1, 0, 0, 0]
    if line["emotion"] == "anger":
        line["emotion"] = [0, 0, 1, 0, 0]
    if line["emotion"] == "surprise":
        line["emotion"] = [0, 0, 0, 1, 0]
    if line["emotion"] == "sadness":
        line["emotion"] = [0, 0, 0, 0, 1]
    return line


def test(analyzed):
    myrdd = analyzed.rdd.map(list)
    myrdd = myrdd.map(transform)
    df = myrdd.toDF(
        ['year', 'id', 'retweet', 'day', 'user', 'month', 'minute', 'sentiment', 'hashtag', 'emotion', 'hour'])
    n = len(df.select("emotion").first()[0])
    m = len(df.select("sentiment").first()[0])
    df = df.filter(df.hashtag.isNotNull()).groupBy("hashtag").agg(
        array(*[somme(col("emotion")[i]) for i in range(n)]).alias("sum_emotion"),
        array(*[somme(col("sentiment")[i]) for i in range(m)]).alias("sum_sentiment"))
    sum_cols = udf(lambda arr: sum(arr), IntegerType())
    df2 = df.withColumn('total', sum_cols(col('sum_sentiment')))
    df2 = df2.sort(desc('total'))
    df2.write.save("/home/mbenhamd/Twitter/ALL_USER_HASHTAG", format="json")


if __name__ == "__main__":
    sc = SparkContext()
    spark = SparkSession(sc)
    myDF = spark.read.json("/media/mbenhamd/A8547F8A547F5A50/Twitter/year/year.json")
    test(myDF)
    spark.stop()
