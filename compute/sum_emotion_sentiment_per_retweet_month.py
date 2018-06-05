from pyspark.sql import SparkSession
from pyspark.sql.functions import desc
from pyspark.sql.types import IntegerType
from pyspark.sql.functions import array, avg, col
from pyspark.sql.functions import sum as somme
from pyspark.sql.functions import udf, explode
from pyspark.sql.functions import lit


def test(spark):
    arr = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    for j in arr:
        df = spark.read.json("/media/mbenhamd/A8547F8A547F5A50/Twitter/month/" + j + ".json")
        n = len(df.select("emotion").first()[0])
        m = len(df.select("sentiment").first()[0])
        df = df.filter(df.retweet.isNotNull()).groupBy("retweet").agg(array(*[somme(col("emotion")[i]) for i in range(n)]).alias("sum_emotion"),
                                       array(*[somme(col("sentiment")[i]) for i in range(m)]).alias("sum_sentiment"))
        sum_cols = udf(lambda arr: sum(arr), IntegerType())
        df2 = df.withColumn("total", sum_cols(col("sum_sentiment")))
	df2 = df2.withColumn('month', lit(j))
        df2 = df2.sort(desc("total"))
        df2.write.save("/home/mbenhamd/Twitter/ALL_RETWEET_" + j, format="json")
        df2.limit(50).write.save("/home/mbenhamd/Twitter/ALL_RETWEET_FIFTY_BEST" + j, format="json")


if __name__ == "__main__":
    spark = SparkSession \
        .builder \
        .appName("Projet BDD") \
        .getOrCreate()
    test(spark)
    spark.stop()
