from pyspark.sql import SparkSession
from pyspark.sql.functions import desc
from pyspark.sql.types import IntegerType
from pyspark.sql.functions import array, avg, col
from pyspark.sql.functions import sum as somme
from pyspark.sql.functions import udf, explode


def test(spark):
    df = spark.read.json("/media/mbenhamd/ssd/Twitter/nohashtag/*")
    df.filter("month =1").write.save("/media/mbenhamd/ssd/Twitter/ALL_01", format="json")
    df.filter("month =2").write.save("/media/mbenhamd/ssd/Twitter/ALL_02", format="json")
    df.filter("month =3").write.save("/media/mbenhamd/ssd/Twitter/ALL_03", format="json")
    df.filter("month =4").write.save("/media/mbenhamd/ssd/Twitter/ALL_04", format="json")
    df.filter("month =5").write.save("/media/mbenhamd/ssd/Twitter/ALL_05", format="json")
    df.filter("month =6").write.save("/media/mbenhamd/ssd/Twitter/ALL_06", format="json")
    df.filter("month =7").write.save("/media/mbenhamd/ssd/Twitter/ALL_07", format="json")
    df.filter("month =8").write.save("/media/mbenhamd/ssd/Twitter/ALL_08", format="json")
    df.filter("month =9").write.save("/media/mbenhamd/ssd/Twitter/ALL_09", format="json")
    df.filter("month =10").write.save("/media/mbenhamd/ssd/Twitter/ALL_10", format="json")
    df.filter("month =11").write.save("/media/mbenhamd/ssd/Twitter/ALL_11", format="json")
    df.filter("month =12").write.save("/media/mbenhamd/ssd/Twitter/ALL_12", format="json")


if __name__ == "__main__":
    spark = SparkSession \
        .builder \
        .appName("Projet BDD") \
        .getOrCreate()
    test(spark)
    spark.stop()
