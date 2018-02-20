import pandas as pd
import numpy as np
import os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn import metrics
from sklearn.linear_model import SGDClassifier
from sklearn.externals import joblib


def load_housing_data(housing_path, name):
    csv_path = os.path.join(housing_path, name)
    return pd.read_csv(csv_path,header=0, delimiter=";")


data_test = load_housing_data("", "data_test.txt")
data_train = load_housing_data("", "data_train.txt")


# -------- MultinomialNB --------

# Training : 

count_vect = CountVectorizer()
X_train_counts = count_vect.fit_transform(data_train.text)
tf_transformer = TfidfTransformer(use_idf=False).fit(X_train_counts)
X_train_tf = tf_transformer.transform(X_train_counts)
clf = MultinomialNB().fit(X_train_tf, data_train.emotion)

# Test : 

docs_new = data_test.text
X_new_counts = count_vect.transform(docs_new)
X_new_tfidf = tf_transformer.transform(X_new_counts)

predicted = clf.predict(X_new_tfidf)

np.mean(predicted == data_test.emotion)
print(metrics.classification_report(data_test.emotion, predicted))



# -------- SVM --------

text_clf = Pipeline([
	('vect', CountVectorizer()),
	('tfidf', TfidfTransformer()),
	('clf', SGDClassifier(
		loss='hinge', 
		penalty='l2',
		alpha=1e-3, 
		random_state=42,
		max_iter=5, 
		tol=None)),
	])

text_clf.fit(data_train.text, data_train.emotion) 

predicted = text_clf.predict(data_test.text)

np.mean(predicted == data_test.emotion)  

print(metrics.classification_report(data_test.emotion, predicted))


# -------- GribSearch --------

parameters = {'vect__ngram_range': [(1, 1), (1, 2)],'tfidf__use_idf': (True, False),'clf__alpha': (1e-2, 1e-3)}

gs_clf = GridSearchCV(text_clf, parameters, n_jobs=-1)
gs_clf = gs_clf.fit(data_train.text, data_train.emotion)
gs_clf.best_score_ 


joblib.dump(gs_clf.best_estimator_, 'filename.pkl')
