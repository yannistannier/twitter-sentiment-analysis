from pyspark.sql import SparkSession
from pyspark.sql.functions import desc
from pyspark.sql.types import IntegerType
from pyspark.sql.functions import array, avg, col
from pyspark.sql.functions import sum as somme
from pyspark.sql.functions import udf, explode
import os


def function(spark):
    path = "/home/mbenhamd/dataset_exemple/"
    for file in os.listdir(path):
        name = os.path.join(path, file)
        df = spark.read.json(name, multiLine=True)
	#Getting Where To Save File
	where = name + '_schema.txt'
	#Getting What To Write To File
	text = str(df.schema)
	#Actually Writing It
	os.mknod(where)
	saveFile = open(where, 'w')
	saveFile.write(text)
	saveFile.close()

# df2.write.save("/media/mbenhamd/ssd/Twitter/ALL_USER_12", format="json")

if __name__ == "__main__":
    spark = SparkSession \
        .builder \
        .appName("Projet BDD") \
        .getOrCreate()
    function(spark)
    spark.stop()
