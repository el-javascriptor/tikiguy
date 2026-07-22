import React from 'react';
import styles from './AreaToolbar.module.css';

interface AreaToolbarProps {
  roomName: string;
  onRoomNameChange: (name: string) => void;
  activeLayer: 'background_far' | 'background_near' | 'gameplay' | 'foreground';
  onLayerChange: (layer: 'background_far' | 'background_near' | 'gameplay' | 'foreground') => void;
  hitboxSnap: boolean;
  onSnapToggle: (snap: boolean) => void;
  showHitboxes: boolean;
  onHitboxesToggle: (show: boolean) => void;
  zoomScale: number;
  onZoomChange: (zoom: number) => void;
  onSave: () => void;
  onLeave: () => void;
}

export const AreaToolbar: React.FC<AreaToolbarProps> = ({
  roomName,
  onRoomNameChange,
  activeLayer,
  onLayerChange,
  hitboxSnap,
  onSnapToggle,
  showHitboxes,
  onHitboxesToggle,
  zoomScale,
  onZoomChange,
  onSave,
  onLeave,
}) => {
  return (
    <div className={styles.toolbar}>
      {/* Room Name Input */}
      <div className={styles.roomGroup}>
        <span className={styles.roomLabel}>Room Name:</span>
        <input
          type="text"
          value={roomName}
          onChange={(e) => onRoomNameChange(e.target.value)}
          className={styles.roomInput}
        />
      </div>

      {/* Layer selector */}
      <div className={styles.layerGroup}>
        <span className={styles.layerLabel}>Layer:</span>
        <select
          value={activeLayer}
          onChange={(e) => onLayerChange(e.target.value as any)}
          className={styles.layerSelect}
        >
          <option value="background_far">Far Background</option>
          <option value="background_near">Near Background</option>
          <option value="gameplay">Gameplay (Solid)</option>
          <option value="foreground">Foreground Decoration</option>
        </select>
      </div>

      {/* Grid Snapping Checkbox */}
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={hitboxSnap}
          onChange={(e) => onSnapToggle(e.target.checked)}
        />
        <span>Snap Grid</span>
      </label>

      {/* Show Hitboxes Checkbox */}
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={showHitboxes}
          onChange={(e) => onHitboxesToggle(e.target.checked)}
        />
        <span>Hitboxes</span>
      </label>

      {/* Zoom Adjusters */}
      <div className={styles.zoomGroup}>
        <span className={styles.zoomLabel}>Zoom:</span>
        <button 
          type="button" 
          onClick={() => onZoomChange(Math.max(0.25, zoomScale - 0.25))} 
          className={styles.zoomBtn}
        >
          -
        </button>
        <span className={styles.zoomText}>{(zoomScale * 100).toFixed(0)}%</span>
        <button 
          type="button" 
          onClick={() => onZoomChange(Math.min(2.0, zoomScale + 0.25))} 
          className={styles.zoomBtn}
        >
          +
        </button>
      </div>

      {/* Save Button with vector icon */}
      <button
        type="button"
        onClick={onSave}
        className={styles.saveBtn}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>save</span>
        <span>Save</span>
      </button>

      {/* Leave Button with vector icon */}
      <button
        type="button"
        onClick={onLeave}
        className={styles.leaveBtn}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>logout</span>
        <span>Leave</span>
      </button>
    </div>
  );
};
