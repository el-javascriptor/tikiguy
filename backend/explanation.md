# Backend API Documentation

This directory contains the Python Flask backend service, which acts as a development database and local server for game creators to upload assets, define bounding boxes, and save room areas.

## Core Files & Folders

1.  **[app.py](file:///home/el_javascriptor/Documents/Code/tikiguy/backend/app.py)**:
    The Flask application serving the Creator Dev Portal. Implements JSON file persistence and file upload streaming.
2.  **[requirements.txt](file:///home/el_javascriptor/Documents/Code/tikiguy/backend/requirements.txt)**:
    Lists Python package dependencies (Flask, Flask-CORS).
3.  **`data/`**:
    Stores saved configuration files. Includes:
    *   `assets_registry.json`: JSON catalog of registered assets and their hitboxes.
4.  **`static/uploads/`**:
    Stores uploaded image spritesheets, named by their SHA-256 hashes.

## API Endpoint Reference

### 1. Health Status
*   **Method**: `GET`
*   **Path**: `/api/health`
*   **Response**: `{"status": "ok", "message": "Tikiguy Backend Live"}`

### 2. File Upload (Deduplicated)
*   **Method**: `POST`
*   **Path**: `/api/upload`
*   **Request**: `multipart/form-data` containing a `'file'` block.
*   **Behavior**: Computes a SHA-256 hash of the upload contents. If the hash matches an existing file, it skips writing the duplicate buffer and returns the existing file's static path.
*   **Response**: `{"url": "/static/uploads/<sha256_hash>.<ext>"}`

### 3. Fetch Asset Registry Catalog
*   **Method**: `GET`
*   **Path**: `/api/assets`
*   **Response**: Array of registered `AssetDefinition` JSON objects.

### 4. Create or Update Asset Record
*   **Method**: `POST`
*   **Path**: `/api/assets`
*   **Request**: JSON `AssetDefinition` structure. Overwrites if ID exists, otherwise appends.
*   **Response**: `{"status": "success", "asset": {...}}`

### 5. Delete Asset Record
*   **Method**: `DELETE`
*   **Path**: `/api/assets/<asset_id>`
*   **Response**: `{"status": "success", "message": "Asset <id> deleted"}`
