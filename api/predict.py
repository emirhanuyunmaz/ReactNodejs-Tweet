# predict.py
import sys
import pickle
import re
import nltk
from nltk.stem.porter import PorterStemmer
durma = nltk.download("stopwords")
from nltk.corpus import stopwords
# Model ve CountVectorizer'ı yükleme
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('count_vectorizer.pkl', 'rb') as cv_file:
    cv = pickle.load(cv_file)

# Girdi metni
input_text = sys.argv[1]

yorum = re.sub('[^a-zA-ZğüşöçıİĞÜŞÖÇ]',' ', input_text)
yorum = yorum.lower()
yorum = yorum.split()
ps = PorterStemmer()
yorum = [ps.stem(kelime) for kelime in yorum if not kelime in set(stopwords.words("turkish"))]
yorum = ' '.join(yorum)

# Metni vektörize etme ve tahmin yapma
input_vector = cv.transform([yorum]).toarray()
prediction = model.predict(input_vector)

print(prediction[0])