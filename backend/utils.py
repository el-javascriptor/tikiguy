import os
import hashlib

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def calculate_file_hash(file_stream):
    sha256 = hashlib.sha256()
    file_stream.seek(0)
    for chunk in iter(lambda: file_stream.read(4096), b""):
        sha256.update(chunk)
    file_stream.seek(0)  # reset stream position
    return sha256.hexdigest()
