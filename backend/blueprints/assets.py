import os
import json
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils import allowed_file, calculate_file_hash

assets_bp = Blueprint('assets', __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
REGISTRY_PATH = os.path.join(BASE_DIR, 'data', 'assets_registry.json')

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(REGISTRY_PATH), exist_ok=True)
if not os.path.exists(REGISTRY_PATH):
    with open(REGISTRY_PATH, 'w') as f:
        json.dump([], f)

@assets_bp.route("/api/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400
        
    if file and allowed_file(file.filename):
        file_hash = calculate_file_hash(file)
        ext = os.path.splitext(file.filename)[1].lower()
        unique_filename = f"{file_hash}{ext}"
        target_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        if not os.path.exists(target_path):
            file.save(target_path)
            
        file_url = f"/static/uploads/{unique_filename}"
        return jsonify({"url": file_url}), 200
    else:
        return jsonify({"error": "Allowed file types are png, jpg, jpeg, gif"}), 400

@assets_bp.route("/api/assets", methods=["GET"])
def get_assets():
    try:
        with open(REGISTRY_PATH, 'r') as f:
            assets = json.load(f)
        return jsonify(assets), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@assets_bp.route("/api/assets", methods=["POST"])
def save_asset():
    try:
        new_asset = request.json
        if not new_asset or 'id' not in new_asset:
            return jsonify({"error": "Invalid asset definition"}), 400
            
        with open(REGISTRY_PATH, 'r') as f:
            assets = json.load(f)
            
        existing_index = next((i for i, a in enumerate(assets) if a['id'] == new_asset['id']), None)
        if existing_index is not None:
            assets[existing_index] = new_asset
        else:
            assets.append(new_asset)
            
        with open(REGISTRY_PATH, 'w') as f:
            json.dump(assets, f, indent=4)
            
        return jsonify({"status": "success", "asset": new_asset}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@assets_bp.route("/api/assets/<asset_id>", methods=["DELETE"])
def delete_asset(asset_id):
    try:
        with open(REGISTRY_PATH, 'r') as f:
            assets = json.load(f)
            
        new_assets = [a for a in assets if a['id'] != asset_id]
        
        if len(new_assets) == len(assets):
            return jsonify({"error": f"Asset {asset_id} not found"}), 404
            
        with open(REGISTRY_PATH, 'w') as f:
            json.dump(new_assets, f, indent=4)
            
        return jsonify({"status": "success", "message": f"Asset {asset_id} deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
