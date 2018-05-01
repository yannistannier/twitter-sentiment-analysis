
import re
import shutil
import json
import csv
import os

from nltk.stem import WordNetLemmatizer
from nltk import word_tokenize
from nltk.corpus import stopwords
from textblob import TextBlob


# ### Preprocessing data

sc.stop()
sc = SparkContext()


myRDD = sc.textFile("aggregatedCorpusCleaned.csv")


def clean_text(line):
    stop = stopwords.words('english')
    wnl = WordNetLemmatizer()
    
    text = ' '.join(line[2:])
    #line = re.sub('[A-Za-z0-9@#!.():/]', '', text)
    #tw = ' '.join(re.sub("(@[A-Za-z0-9]+)|([^.'’0-9A-Za-z \t])|(\w+:\/\/\S+)"," ",text).split())
    #tw = re.sub(r"[^.’A-Za-z0-9 ]+", '', tw)
    tw = re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)"," ",text)
    tw = re.sub(r'(.)\1+', r'\1\1', tw).split()
    
    tw = [x for x in tw if x not in stop]
    tw = [wnl.lemmatize(x) for x in tw]
    #tw = [ str(TextBlob(x).correct()) for x in tw ]
    tw = ' '.join(tw)
    
#     sent = "1"
#     if line[0] == "1" or line[0] == "2":
#         sent = "1"
#     if line[0] == "3":
#         sent = "2"
#     if line[0] == "4" or line[0] == "5":
#         sent = "3"
    
    return str(sent+";"+tw.lower())




res = myRDD\
    .map(lambda line : line.split(",") )\
    .map(clean_text)\
    .filter(lambda line: len(line) > 3)\
    .collect()

with open('dataset_processed_ternary.txt','w') as f:
    f.write("sentiment;text\n")
    f.write("\n".join(res))