
run spark
```
./spark-2.1.0-bin-hadoop2.7/bin/spark-submit --packages com.amazonaws:aws-java-sdk:1.7.4,org.apache.hadoop:hadoop-aws:2.7.3  --conf spark.executor.extraJavaOptions=-Dcom.amazonaws.services.s3.enableV4=true --conf spark.hadoop.mapreduce.fileoutputcommitter.algorithm.version=2 --conf spark.speculation=false --conf spark.driver.extraJavaOptions=-Dcom.amazonaws.services.s3.enableV4=true twitter.py
```


set aws credentials
```
export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxxxx
```