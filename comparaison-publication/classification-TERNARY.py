import re
import os
import pandas as pd
import numpy as np
from sklearn import svm
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer, TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import SGDClassifier, LogisticRegression
from sklearn.naive_bayes import GaussianNB, MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn import tree
from nltk import word_tokenize
from nltk.corpus import stopwords
from textblob import TextBlob
from nltk.stem import WordNetLemmatizer 
from sklearn.neural_network import MLPClassifier
from sklearn import metrics


# In[48]:


def load(housing_path, name):
    csv_path = os.path.join(housing_path, name)
    return pd.read_csv(csv_path,header=0, delimiter=";")


# In[49]:


datas = load("", "dataset_processed_ternary.txt")
X_train, X_test = train_test_split(datas, test_size=0.20)


# ### Naives Bayes

# In[55]:


nb = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', MultinomialNB())])
nb.fit(X_train.text, X_train.sentiment) 


# In[56]:


predicted = nb.predict(X_test.text)


# In[57]:


print(metrics.classification_report(X_test.sentiment, predicted))

# precision    recall  f1-score   support
#
#          1       0.63      0.85      0.72      3663
#          2       0.66      0.54      0.60      2947
#          3       0.65      0.46      0.54      2492
#
# avg / total       0.65      0.64      0.63      9102




# ### Logistic regression

# In[39]:


lr = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', LogisticRegression())])
lr.fit(X_train.text, X_train.sentiment)
predicted2 = lr.predict(X_test.text)


# In[40]:


print(metrics.classification_report(X_test.sentiment, predicted2))



# precision    recall  f1-score   support
#
#          1       0.69      0.79      0.74      3634
#          2       0.67      0.62      0.64      3022
#          3       0.66      0.58      0.62      2446
#
# avg / total       0.67      0.68      0.67      9102


# ### Décision tree

# In[16]:


tr = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', tree.DecisionTreeClassifier())])
tr.fit(X_train.text, X_train.sentiment) 


# In[17]:


predicted3 = tr.predict(X_test.text)
print(metrics.classification_report(X_test.sentiment, predicted3))


# precision    recall  f1-score   support
#
#          1       0.68      0.67      0.68      3640
#          2       0.58      0.59      0.59      2998
#          3       0.59      0.57      0.58      2464
#
# avg / total       0.62      0.62      0.62      9102



# ### Random forest

# In[18]:


rf = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', RandomForestClassifier())])
rf.fit(X_train.text, X_train.sentiment) 


# In[20]:


predicted4 = rf.predict(X_test.text)
print(metrics.classification_report(X_test.sentiment, predicted4))



# precision    recall  f1-score   support
#
#          1       0.68      0.76      0.72      3640
#          2       0.62      0.62      0.62      2998
#          3       0.66      0.53      0.58      2464
#
# avg / total       0.65      0.65      0.65      9102



# ### SGB classifier

# In[21]:


sg = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', SGDClassifier() )])
sg.fit(X_train.text, X_train.sentiment) 


# In[22]:


predicted5 = sg.predict(X_test.text)
print(metrics.classification_report(X_test.sentiment, predicted5))


# precision    recall  f1-score   support
#
#          1       0.67      0.82      0.74      3640
#          2       0.67      0.57      0.62      2998
#          3       0.66      0.55      0.60      2464
#
# avg / total       0.66      0.67      0.66      9102




# ### Linear SVM

# In[25]:


svc = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', LinearSVC())])
svc.fit(X_train.text, X_train.sentiment) 


# In[26]:


predicted6 = svc.predict(X_test.text)
print(metrics.classification_report(X_test.sentiment, predicted6))



# precision    recall  f1-score   support
#
#          1       0.70      0.74      0.72      3640
#          2       0.64      0.60      0.62      2998
#          3       0.63      0.60      0.61      2464
#
# avg / total       0.66      0.66      0.66      9102


# #### MLP 

# In[32]:


mlp = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', MLPClassifier(verbose=True,solver='lbfgs', learning_rate_init=.01,
                                           alpha=1e-4, hidden_layer_sizes=(50,), 
                                           random_state=1) )])


# In[33]:


mlp.fit(X_train.text, X_train.sentiment) 


# In[34]:


predicted7 = mlp.predict(X_test.text)
print(metrics.classification_report(X_test.sentiment, predicted7))

# precision    recall  f1-score   support
#
#          1       0.71      0.71      0.71      3640
#          2       0.62      0.62      0.62      2998
#          3       0.62      0.63      0.62      2464
#
# avg / total       0.65      0.65      0.65      9102

