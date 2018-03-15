import json
from pyspark import SparkContext
from pyspark.sql import SparkSession


def stats(df):    
    df2 = df.stat.crosstab("emotion", "sentiment") 	
    df2.write.save("/home/mbenhamd/Twitter/ALL_USER_HASHTAG", format="json")

if __name__ == "__main__":
    sc = SparkContext()
    spark = SparkSession(sc)
    myDF = spark.read.json("/media/mbenhamd/A8547F8A547F5A50/Twitter/year/year.json")
    stats(myDF)
    spark.stop()
