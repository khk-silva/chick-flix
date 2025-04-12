from flask import Flask, request, jsonify
from keras.preprocessing import image
import numpy as np
from PIL import Image
import io
from tensorflow.keras.models import load_model
from sklearn.svm import SVC  
import joblib 
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

# Load the feature extraction model and the SVM model
feature_model = load_model('models/4_feature_model.h5')
svm_model = joblib.load('models/4_svm_model.pkl')

IMAGE_SIZE = (224, 224) 

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    # Ensure a file is uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
       
        img = Image.open(file.stream)  
        img = img.resize(IMAGE_SIZE)  

       
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0  # Normalize the image

       
        features = feature_model.predict(img_array)
        features = features.reshape(1, -1)  # Flatten the features for SVM input

       
        prediction_probs = svm_model.predict_proba(features)
        max_prob = np.max(prediction_probs)
        prediction = svm_model.predict(features)

         #  Reject low-confidence predictions
        if max_prob < 0.9: 
            return jsonify({'error': 'Uncertain prediction, please upload a clear chicken image'}), 400


        breed_names = ["Australorp", "Black star", "Blue Plymouth Rock", "Brahma"
                       , "Leghorn", "Lohman", "PlymouthRock",
                       "Wyandotte"]  # List of breed names
        predicted_breed = breed_names[prediction[0]]

        # Check if the predicted breed is in the list of recognized breeds
        if predicted_breed not in breed_names:
            return jsonify({'error': 'Unrecognized breed detected'}), 400

        # Returning the breed and the prediction probability
        return jsonify({
            'breed': predicted_breed,
            'confidence': max_prob
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500   
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
