import React, { useState, useRef } from 'react';
import styles from './AssetUploader.module.css';

interface AssetUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export const AssetUploader: React.FC<AssetUploaderProps> = ({ onUploadSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragging(true);
    } else if (e.type === "dragleave") {
      setDragging(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, etc.)");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Upload failed");
      }

      const data = await response.json();
      onUploadSuccess(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload file to backend.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <div className={styles.icon}>
        {uploading ? (
          <span className={`material-symbols-rounded ${styles.spinIcon}`} style={{ fontSize: '3rem' }}>sync</span>
        ) : (
          <span className="material-symbols-rounded" style={{ fontSize: '3rem' }}>cloud_upload</span>
        )}
      </div>
      {uploading ? (
        <p className={styles.uploadingText}>Uploading spritesheet...</p>
      ) : (
        <>
          <h3 className={styles.title}>Drag & Drop Spritesheet</h3>
          <p className={styles.subtitle}>
            or click to browse local files (PNG, JPG, GIF)
          </p>
        </>
      )}
      {error && (
        <p className={styles.errorText}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};
