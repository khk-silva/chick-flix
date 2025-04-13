import os
import joblib
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import gdown  

# --- Google Drive file IDs  ---
FEATURE_MODEL_ID = "14U4_RIK_tt6jz4gwxfjPMVZW_mNLzfa7"
SVM_MODEL_ID = "1Q1JafbPb_rQs0oPVljaLUwE1R9YA9o-p"

# --- Output paths ---
feature_model_path = "models/4_feature_model.h5"
svm_model_path = "models/4_svm_model.pkl"

# --- Ensure models directory exists ---
os.makedirs("models", exist_ok=True)

# --- Function to download using gdown ---
def download_file_from_drive(file_id, output_path):
    if not os.path.exists(output_path):
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, output_path, quiet=False)

# --- Download if missing ---
download_file_from_drive(FEATURE_MODEL_ID, feature_model_path)
download_file_from_drive(SVM_MODEL_ID, svm_model_path)

# --- Load models ---
feature_model = load_model(feature_model_path)
svm_model = joblib.load(svm_model_path)

# --- Flask app setup ---
app = Flask(__name__)
CORS(app)
IMAGE_SIZE = (224, 224)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        img = Image.open(file.stream)
        img = img.resize(IMAGE_SIZE)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        features = feature_model.predict(img_array)
        features = features.reshape(1, -1)

        prediction_probs = svm_model.predict_proba(features)
        max_prob = np.max(prediction_probs)
        prediction = svm_model.predict(features)

        if max_prob < 0.9:
            return jsonify({'error': 'Uncertain prediction, please upload a clear chicken image'}), 400

        breed_names = [
            "Australorp", "Black star", "Blue Plymouth Rock", "Brahma",
            "Leghorn", "Lohman", "PlymouthRock", "Wyandotte"
        ]
        predicted_breed = breed_names[prediction[0]]

        return jsonify({
            'breed': predicted_breed,
            'confidence': float(max_prob)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
