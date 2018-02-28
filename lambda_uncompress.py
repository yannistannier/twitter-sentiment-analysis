import os
import tempfile
import zipfile
import bz2

from concurrent import futures
from io import BytesIO

import boto3

s3 = boto3.client('s3')


def lambda_handler(event, context):
    # Parse and prepare required items from event
    global bucket, path, zipdata
    event = next(iter(event['Records']))
    bucket = event['s3']['bucket']['name']
    key = event['s3']['object']['key']
    path = os.path.dirname(key)
    
    # Create temporary file
    temp_file = tempfile.mktemp()
    # Fetch and load target file
    s3.download_file(bucket, key, temp_file)
    #zipdata = zipfile.ZipFile(temp_file)
    zipdata = bz2.BZ2File(temp_file)
    # Call action method with using ThreadPool
    s3.upload_fileobj(
        BytesIO(zipdata.read()),
        bucket,
        key.replace(".bz2", "")
    )
    
    # Remove extracted archive file
    s3.delete_object(Bucket=bucket, Key=key)


    return None
