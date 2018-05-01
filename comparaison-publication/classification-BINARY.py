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
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from nltk import word_tokenize
from nltk.corpus import stopwords
from textblob import TextBlob
from nltk.stem import WordNetLemmatizer 
from sklearn import metrics


# In[17]:


def load(housing_path, name):
    csv_path = os.path.join(housing_path, name)
    return pd.read_csv(csv_path,header=0, delimiter=";")


# In[23]:


datas = load("", "dataset_processed_public.txt")
X_train, X_test = train_test_split(datas, test_size=0.20, random_state=42)


# ## RandomForest

# In[9]:


lr = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', RandomForestClassifier(max_depth = 100, min_samples_split=100))])
lr.fit(X_train.text, X_train.sentiment) 


# In[10]:


predicted = lr.predict(X_test.text)


# In[11]:


print(metrics.classification_report(X_test.sentiment, predicted))



#                 precision    recall  f1-score   support
#
#          0       0.75      0.65      0.70    157266
#          1       0.69      0.79      0.74    157305
#
# avg / total       0.72      0.72      0.72    314571



# ## Linear SVM

# In[24]:


svc = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', LinearSVC())])
svc.fit(X_train.text.values.astype('U'), X_train.sentiment) 


# In[25]:


predicted = svc.predict(X_test.text.values.astype('U'))


# In[26]:


print(metrics.classification_report(X_test.sentiment, predicted))



#               precision    recall  f1-score   support
#
#          0       0.79      0.76      0.78    157266
#          1       0.77      0.79      0.82    157305
#
# avg / total       0.78      0.78      0.80    314571


# ## Naives Bayes

# In[13]:


nb = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', MultinomialNB())])
nb.fit(X_train.text.values.astype('U'), X_train.sentiment) 


# In[14]:


predicted = nb.predict(X_test.text.values.astype('U'))


# In[15]:


np.mean(predicted == X_test.sentiment)  


# In[31]:


print(metrics.classification_report(X_test.sentiment, predicted))



# precision    recall  f1-score   support
#
#          0       0.76      0.77      0.77    157266
#          1       0.77      0.76      0.76    157305
#
# avg / total       0.76      0.76      0.76    314571



# ## Logistic regression

# In[33]:


lr = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', LogisticRegression())])
lr.fit(X_train.text, X_train.sentiment) 


# In[34]:


predicted2 = lr.predict(X_test.text)


# In[35]:


print(metrics.classification_report(X_test.sentiment, predicted2))
np.mean(predicted2 == X_test.sentiment)  



# precision    recall  f1-score   support
#
#          0       0.79      0.77      0.78    157266
#          1       0.77      0.80      0.79    157305
#
# avg / total       0.78      0.78      0.78    314571


# In[16]:


np.mean(predicted2 == X_test.sentiment)  


# ## Decision tree

# In[7]:


tr = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', tree.DecisionTreeClassifier(max_depth=100))])
tr.fit(X_train.text, X_train.sentiment) 


# In[8]:


predicted3 = tr.predict(X_test.text)


# In[9]:


print(metrics.classification_report(X_test.sentiment, predicted3))


# precision    recall  f1-score   support
#
#          0       0.77      0.54      0.63    157266
#          1       0.65      0.84      0.73    157305
#
# avg / total       0.71      0.69      0.68    314571


# In[10]:


np.mean(predicted3 == X_test.sentiment)  



# ## SGB classifier

# In[10]:


lr = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', SGDClassifier(loss='hinge', penalty='l2',alpha=1e-3, random_state=42,max_iter=5, tol=None) )])


# In[6]:


predicted = lr.predict(X_test.text)


# In[7]:


print(metrics.classification_report(X_test.sentiment, predicted))



# precision    recall  f1-score   support
#
#          0       0.76      0.70      0.73    157266
#          1       0.72      0.78      0.75    157305
#
# avg / total       0.74      0.74      0.74    314571

# In[11]:


parameters = {'vect__ngram_range': [(1, 1), (1, 2)],'tfidf__use_idf': (True, False),'clf__alpha': (1e-2, 1e-3)}


# In[12]:


gs_clf = GridSearchCV(lr, parameters, n_jobs=-1)


# In[13]:


gs_clf = gs_clf.fit(X_train.text, X_train.sentiment)


# In[14]:


gs_clf.best_score_  


# ## Perceptron

# In[20]:


lr = Pipeline([('vect', CountVectorizer()),
                     ('tfidf', TfidfTransformer()),
                     ('clf', Perceptron(max_iter=150) )])


# In[21]:


pr.fit(X_train.text, X_train.sentiment) 


# In[22]:


predicted2 = pr.predict(X_test.text)


# In[23]:


print(metrics.classification_report(X_test.sentiment, predicted2))


# precision    recall  f1-score   support
#
#          0       0.69      0.73      0.71    157266
#          1       0.71      0.67      0.69    157305
#
# avg / total       0.70      0.70      0.70    314571

