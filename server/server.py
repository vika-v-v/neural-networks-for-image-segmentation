# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from apiEndpoints.mattmdjaga.model_handler import SegformerClothesModel
from apiEndpoints.nvidia.segformer_ade_handler import SegformerADEModel

app = Flask(__name__)
CORS(app)

# Initialize model handler
model_handler = SegformerClothesModel("mattmdjaga/segformer_b2_clothes")
ade_model_handler = SegformerADEModel("nvidia/segformer-b3-finetuned-ade-512-512")

@app.route('/mattmdjaga/segformer_b2_clothes/segment', methods=['POST'])
def segment_image():
    try:
        content = request.json
        if not content or 'url' not in content:
            return jsonify({'error': 'Missing URL'}), 400

        url = content['url']
        segments = model_handler.segment_image(url)
        return jsonify(segments)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/nvidia/segformer-b3-finetuned-ade-512-512/segment', methods=['POST'])
def segment_ade_image():
    try:
        content = request.json
        if not content or 'url' not in content:
            return jsonify({'error': 'Missing URL'}), 400

        url = content['url']
        segments = ade_model_handler.segment_image(url)
        return jsonify(segments)

    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=6000)
