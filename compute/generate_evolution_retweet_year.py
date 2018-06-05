from pyspark.sql import SparkSession
from pyspark.sql.functions import desc
from pyspark.sql.types import IntegerType
from pyspark.sql.functions import array, avg, col
from pyspark.sql.functions import sum as somme
from pyspark.sql.functions import udf, explode, concat_ws, collect_list


def test(spark):
    df = spark.read.json("/media/mbenhamd/A8547F8A547F5A50/Twitter/year/year.json")
    df = df.withColumn('list_day',concat_ws('-',col('minute'),col('hour'),col('day'),col('month'),col('year')))
    df = df.filter(df.retweet.isNotNull()).groupBy("retweet").agg(collect_list('list_day').alias("list_day"),collect_list('emotion').alias("list_emotion"),collect_list('sentiment').alias("list_sentiment"))
    df.write.save("/home/mbenhamd/ALL_RETWEET", format="json")

if __name__ == "__main__":
    spark = SparkSession \
        .builder \
        .appName("Projet BDD") \
	.enableHiveSupport() \
        .getOrCreate()
    test(spark)
    spark.stop()
