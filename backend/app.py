import os
from flask import Flask, jsonify
from flask_cors import CORS
from blueprints.assets import assets_bp
from blueprints.areas import areas_bp

app = Flask(__name__)
# Enable CORS so our Vite dev server can make requests to Flask
CORS(app)

# Register Feature Blueprints
app.register_blueprint(assets_bp)
app.register_blueprint(areas_bp)

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Modular Tikiguy Backend Live"}), 200

if __name__ == "__main__":
    app.run(port=5001, debug=True)
