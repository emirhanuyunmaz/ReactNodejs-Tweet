from flask import Flask, request, jsonify
import pickle
import re
import nltk
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords

# NLTK stopwords verisini indir (ilk seferlik)
nltk.download("stopwords")

# Model ve CountVectorizer'ı yükle
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('count_vectorizer.pkl', 'rb') as cv_file:
    cv = pickle.load(cv_file)

# Flask uygulaması oluştur
app = Flask(__name__)

# Porter Stemmer
ps = PorterStemmer()

# API rotası oluştur
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # JSON'dan veriyi al
    input_text = data['text']  # Metni al
    
    # Metin işleme (Türkçe stopwords ve stemming)
    yorum = re.sub('[^a-zA-ZğüşöçıİĞÜŞÖÇ]',' ', input_text)
    yorum = yorum.lower()
    yorum = yorum.split()
    yorum = [ps.stem(kelime) for kelime in yorum if not kelime in set(stopwords.words("turkish"))]
    yorum = ' '.join(yorum)
    
    # Vektörize et ve tahmin yap
    input_vector = cv.transform([yorum]).toarray()
    prediction = model.predict(input_vector)

    # Tahmin sonucunu JSON olarak geri döndür
    return jsonify({'prediction': prediction[0]})

# Flask uygulamasını çalıştır
if __name__ == '__main__':
    app.run(debug=True)
