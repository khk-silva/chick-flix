from flask import Flask, request, jsonify
from keras.preprocessing import image
import numpy as np
from PIL import Image
import io
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.layers import Input, Dense
from sklearn.svm import SVC  
import joblib 
from flask_cors import CORS
import h5py
import os

# Configuration
IMAGE_SIZE = (224, 224)
CHUNK_DIR = 'models/output_chunks'  # Directory containing your chunk files

app = Flask(__name__)
CORS(app)

def load_model_from_chunks(chunk_dir):
    """Load and reconstruct the model from chunk files"""
    # First, find all chunk files
    chunk_files = sorted([f for f in os.listdir(chunk_dir) if f.startswith('chunk_') and f.endswith('.h5')])
    
    if not chunk_files:
        raise ValueError("No chunk files found in the specified directory")
    
    # Initialize a dictionary to hold all layers
    model_parts = {}
    
    # Load each chunk file and collect the layers
    for chunk_file in chunk_files:
        with h5py.File(os.path.join(chunk_dir, chunk_file), 'r') as f:
            f.visititems(lambda name, obj: model_parts.update({name: obj[()]}) if isinstance(obj, h5py.Dataset) else None)
    
    # Reconstruct the model architecture
    input_layer = Input(shape=(224, 224, 3))
    
    # Reconstruct dense layers from the parts
    # Note: You'll need to adapt this based on your actual model architecture
    kernel_parts = [v for k, v in model_parts.items() if 'kernel_part_' in k]
    bias_parts = [v for k, v in model_parts.items() if 'bias' in k and 'kernel' not in k]
    
    # Sort the parts to ensure correct ordering
    kernel_parts.sort(key=lambda x: int(x[0].split('_part_')[-1]))
    bias_parts.sort(key=lambda x: int(x[0].split('_')[-1])) if bias_parts else None
    
    # Combine kernel parts
    full_kernel = np.concatenate(kernel_parts, axis=0)
    
    # Create the dense layer
    dense_layer = Dense(units=full_kernel.shape[1], activation='relu')
    
    # Build the feature extraction model
    x = dense_layer(input_layer)
    feature_model = Model(inputs=input_layer, outputs=x)
    
    # Manually set the weights
    dense_layer.set_weights([full_kernel, bias_parts[0] if bias_parts else np.zeros(full_kernel.shape[1])])
    
    return feature_model

# Load models
try:
    print("Loading feature model from chunks...")
    feature_model = load_model_from_chunks(CHUNK_DIR)
    print("Feature model loaded successfully")
    
    print("Loading SVM model...")
    svm_model = joblib.load('models/4_svm_model.pkl')
    print("SVM model loaded successfully")
except Exception as e:
    print(f"Error loading models: {str(e)}")
    raise

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

        breed_names = ["Australorp", "Black star", "Blue Plymouth Rock", "Brahma",
                     "Leghorn", "Lohman", "PlymouthRock", "Wyandotte"]
        predicted_breed = breed_names[prediction[0]]

        if predicted_breed not in breed_names:
            return jsonify({'error': 'Unrecognized breed detected'}), 400

        return jsonify({
            'breed': predicted_breed,
            'confidence': float(max_prob)  # Convert numpy float to Python float
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500   
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)