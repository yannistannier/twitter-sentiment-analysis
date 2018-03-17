from pyspark.sql import SparkSession
from pyspark.sql.functions import desc
from pyspark.sql.types import IntegerType
from pyspark.sql.functions import array, avg, col
from pyspark.sql.functions import sum as somme
from pyspark.sql.functions import udf, explode


def test(spark):
    df = spark.read.json("/media/mbenhamd/1584A60804F0023E/Twitter/sum_emotion_sentiment/year/sum_user_emotion_sentiment_YEAR.json")
    df2 = df.sort(desc('total'))
    df2.limit(50).write.save("/home/mbenhamd/Twitter/ALL_USER_YEAR_BEST", format="json")

if __name__ == "__main__":
    spark = SparkSession \
        .builder \
        .appName("Projet BDD") \
        .getOrCreate()
    test(spark)
    spark.stop()

