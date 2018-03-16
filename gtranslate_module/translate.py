import json
import re
from emoji.unicode_codes import UNICODE_EMOJI
from googletrans import Translator
from pyspark import SparkContext
from pyspark.sql import SparkSession


# df = df.filter(df.name.isNotNull())
# chiffre magique = Long = 148211291
# chiffre 2 = 112528981
# longeur du tweet colonne


def clean_text(str):
    for c in str:
        if c in UNICODE_EMOJI:
            str = str.replace(c, '')
    str = re.sub(r"http\S+", "", str.strip())
    str = re.sub(r'^(\w+)\s\|{3}\s(\w+)\s\|{3}\s(.*)', ' ', str)
    str = str.replace('\n', ' ')
    str = re.sub('[/\W+/g]', ' ', str)
    str = re.sub('\W+', ' ', str)
    str = re.sub('\p{ASCII}', ' ', str)
    str = re.sub('\p{Punct}', ' ', str)
    str = re.sub('\p{P}', ' ', str)
    pattern = re.compile('[\W_]+', re.UNICODE)
    str = re.sub(pattern, ' ', str)
    return str


def compute(str):
    try:
        translator = Translator()
        str_final = translator.translate(clean_text(str))
        final_string = ' '.join(
            re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", str_final.text).split())
        return final_string
    except Exception:
        pass


if __name__ == "__main__":
    sc = SparkContext()
    sc._jsc.hadoopConfiguration().set("mapreduce.fileoutputcommitter.algorithm.version", "2")
    sc._jsc.hadoopConfiguration().set("speculation", "false")

    myRDD = sc.textFile("/media/mbenhamd/A8547F8A547F5A50/Twitter/untitled/1.json")

    analyzed = myRDD.map(lambda lineTest: json.loads(lineTest)).map(lambda x: [
        {'text': compute(x['text']), 'created_at': x['created_at'], 'followers_count': x['followers_count'],
         'friends_count': x['friends_count'], 'lang': x['lang'], 'name': x['name'], 'retweet_count': x['retweet_count']}]).flatMap(
        lambda x: x)
    analyzed.saveAsTextFile("/home/mbenhamd/TEST")
