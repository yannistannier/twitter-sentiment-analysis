from pyspark.sql import SparkSession
from pyspark.sql.functions import desc
from pyspark.sql.types import IntegerType
from pyspark.sql.functions import array, avg, col
from pyspark.sql.functions import sum as somme
from pyspark.sql.functions import udf, explode, concat_ws, collect_list


def test(spark):
    df = spark.read.json("/media/mbenhamd/ssd/Twitter/year/year.json")
    #n = len(df.select("emotion").first()[0])
    #m = len(df.select("sentiment").first()[0])
    df = df.withColumn('list_day', 
                    concat_ws('-',col('minute'),col('hour'),col('day'),col('month'),col('year')))
    df = df.groupBy("user").agg(collect_list('list_day').alias("list_day"),collect_list('emotion').alias("list_emotion"),collect_list('sentiment').alias("list_sentiment"))
    df.write.save("/home/mbenhamd/ALL_RETWEET", format="json")
    #df = df.groupBy("user").
    #sum_cols = udf(lambda arr: sum(arr), IntegerType())
    #df2 = df.withColumn('total', sum_cols(col('sum_sentiment')))
    #df2.write.save("/media/mbenhamd/ssd/Twitter/ALL_RETWEET", format="json")

if __name__ == "__main__":
    spark = SparkSession \
        .builder \
        .appName("Projet BDD") \
        .getOrCreate()
    test(spark)
    spark.stop()
