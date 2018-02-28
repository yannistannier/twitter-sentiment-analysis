## Description

API RESTFUL with AWS Api Gateway and AWS Lambda


Api gateway => create api => creathe ressource (Enable API Gateway CORS) => create method (Integration type : Lambda fonction, Use Lambda Proxy integration ) => Deploy API

## Create package lambda

create virtual env and install depencies
```
virtualenv env
source env/bin/active
pip instal requests
``` 

go site-packages and create zip
```
cd $VIRTUAL_ENV/lib/python3.6/site-packages
zip -r9 ~/lambda.zip *
``` 

add lambda function
```
cd ~
zip -g lambda.zip lambda_function.py
``` 

and upload to lambda