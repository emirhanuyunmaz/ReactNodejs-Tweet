from flask import Flask, request, jsonify
import pickle
import re
import nltk
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords
from PIL import Image
import numpy as np
import base64
import io
from keras import Sequential
from keras._tf_keras.keras.models import load_model
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
# NLTK stopwords verisini indir 
nltk.download("stopwords")
import tensorflow as tf
tf.config.list_physical_devices('CPU')
from keras._tf_keras.keras.preprocessing.image import img_to_array,load_img 


# Görseli ön işleme fonksiyonu
def preprocess_image(image_data):

    try:
        # Görüntüyü aç
        image = Image.open(io.BytesIO(image_data)).convert("L")  # Gri tonlama
        image = image.resize((48, 48))  # Yeniden boyutlandır
        image_array = img_to_array(image)
        image_array /= 255.0  # Normalize et
        image_array = image_array.reshape(1, 48, 48, 1)  # Model giriş şekline dönüştür
        # print(image_array)
        return image_array
    except Exception as e:
        raise ValueError(f"Image processing failed: {e}")

#Resim sınıflandırma işlemi için modelin yüklenmesi işlemi

# image_classification = Sequential()
# image_classification = load_model("emotiondetector.keras")
image_classification = load_model("emotiondetector_2.keras")
# Model ve CountVectorizer'ı yükleme işlemi.
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('count_vectorizer.pkl', 'rb') as cv_file:
    cv = pickle.load(cv_file)

# Flask uygulaması oluştur
app = Flask(__name__)

ps = PorterStemmer()

# API rotası oluştur
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # JSON'dan veriyi al
    input_text = data['text']  # Metni al
    print("DATA:;",input_text)
    # Metin işleme
    yorum = re.sub('[^a-zA-ZğüşöçıİĞÜŞÖÇ]',' ', input_text)
    yorum = yorum.lower()
    yorum = yorum.split()
    yorum = [ps.stem(kelime) for kelime in yorum if not kelime in set(stopwords.words("turkish"))]
    yorum = ' '.join(yorum)
    
    # Vektörize et ve tahmin yap
    input_vector = cv.transform([yorum]).toarray()
    prediction = model.predict(input_vector)

    # Tahmin sonucunu geri döndürme işlemi.
    return jsonify({'prediction': prediction[0]})

# resim sınıflandırma işlemi
@app.route('/predictImage', methods=['POST'])
def predict_image():
    print("RESİM Sınıflandırma işlemi")
    try:
        # Base64 formatındaki veriyi al
        data = request.json.get('text')
        # print(data)
        if not data:
            return jsonify({'error': 'No image data provided'}), 400

        # Base64 string'i byte verisine çevir
        image_data = base64.b64decode(data)
        # Görseli işle ve tahmini al
        processed_image = preprocess_image(image_data)
        predictions = image_classification.predict(processed_image)
        # print("::::SSSSSSSS:::",predictions.tolist())
        predicted_class = int(np.argmax(predictions))
        class_name = ["korku","kızgın","mutlu","surpriz","üzgün"]
        # Sonucu döndür
        return jsonify({'prediction': class_name[predicted_class], 'confidence': predictions.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Flask uygulamasını çalıştır
if __name__ == '__main__':
    app.run(debug=True)
