import os
import json
from flask import Blueprint, request, jsonify

areas_bp = Blueprint('areas', __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AREAS_FOLDER = os.path.join(BASE_DIR, 'data', 'areas')

os.makedirs(AREAS_FOLDER, exist_ok=True)

@areas_bp.route("/api/areas", methods=["GET"])
def get_areas_list():
    try:
        areas = []
        for filename in os.listdir(AREAS_FOLDER):
            if filename.endswith(".json"):
                filepath = os.path.join(AREAS_FOLDER, filename)
                try:
                    with open(filepath, 'r') as f:
                        data = json.load(f)
                        areas.append({
                            "id": data.get("id"),
                            "name": data.get("name"),
                            "gridCols": data.get("gridCols", 20),
                            "gridRows": data.get("gridRows", 15),
                            "instancesCount": len(data.get("assets", []))
                        })
                except Exception:
                    pass
        return jsonify(areas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@areas_bp.route("/api/areas/<area_id>", methods=["GET"])
def get_area(area_id):
    clean_id = "".join(c for c in area_id if c.isalnum() or c in ('_', '-'))
    filepath = os.path.join(AREAS_FOLDER, f"{clean_id}.json")
    if not os.path.exists(filepath):
        return jsonify({"error": f"Area {area_id} not found"}), 404
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@areas_bp.route("/api/areas", methods=["POST"])
def save_area():
    try:
        data = request.json
        if not data or 'id' not in data:
            return jsonify({"error": "Invalid area layout data"}), 400
            
        area_id = data['id']
        clean_id = "".join(c for c in area_id if c.isalnum() or c in ('_', '-'))
        if not clean_id:
            return jsonify({"error": "Invalid character in area ID"}), 400
            
        filepath = os.path.join(AREAS_FOLDER, f"{clean_id}.json")
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)
            
        return jsonify({"status": "success", "area": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@areas_bp.route("/api/areas/<area_id>", methods=["DELETE"])
def delete_area(area_id):
    clean_id = "".join(c for c in area_id if c.isalnum() or c in ('_', '-'))
    filepath = os.path.join(AREAS_FOLDER, f"{clean_id}.json")
    if not os.path.exists(filepath):
        return jsonify({"error": f"Area {area_id} not found"}), 404
    try:
        os.remove(filepath)
        return jsonify({"status": "success", "message": f"Area {area_id} deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
