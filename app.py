from flask import Flask, request, jsonify
import os
from model import face_verification  # Import the face verification function

app = Flask(__name__)

# Ensure the uploads folder exists
os.makedirs('uploads', exist_ok=True)

@app.route('/verify_faces', methods=['POST'])
def verify_faces():
    # Check if the request contains two images
    if 'image1' not in request.files or 'image2' not in request.files:
        return jsonify({"error": "Both images are required"}), 400

    # Retrieve images from the request
    image1 = request.files['image1']
    image2 = request.files['image2']

    # Save the images to the 'uploads' folder temporarily
    image1_path = os.path.join("uploads", image1.filename)
    image2_path = os.path.join("uploads", image2.filename)

    image1.save(image1_path)
    image2.save(image2_path)

    # Call the face verification function from model.py
    try:
        match = face_verification(image1_path, image2_path)  # Get the match result
        if match:
            return jsonify({"match": True, "message": "Same person"})
        else:
            return jsonify({"match": False, "message": "Different person"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the uploaded files (optional)
        os.remove(image1_path)
        os.remove(image2_path)

if __name__ == '__main__':
    app.run(debug=True)
