import React from 'react';

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
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
      padding: '0.75rem 1.25rem',
      fontSize: '0.85rem'
    }}>
      {/* Room Name Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1 }}>
        <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>Room Name:</span>
        <input
          type="text"
          value={roomName}
          onChange={(e) => onRoomNameChange(e.target.value)}
          style={{
            background: 'var(--bg-dark)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '0.35rem 0.5rem',
            borderRadius: '4px',
            fontFamily: 'inherit',
            outline: 'none',
            fontSize: '0.85rem'
          }}
        />
      </div>

      {/* Layer selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Layer:</span>
        <select
          value={activeLayer}
          onChange={(e) => onLayerChange(e.target.value as any)}
          style={{
            background: 'var(--bg-dark)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '0.35rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          <option value="background_far">Far Background</option>
          <option value="background_near">Near Background</option>
          <option value="gameplay">Gameplay (Solid)</option>
          <option value="foreground">Foreground Decoration</option>
        </select>
      </div>

      {/* Grid Snapping Checkbox */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-primary)', userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={hitboxSnap}
          onChange={(e) => onSnapToggle(e.target.checked)}
        />
        <span>Snap Grid</span>
      </label>

      {/* Show Hitboxes Checkbox */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-primary)', userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={showHitboxes}
          onChange={(e) => onHitboxesToggle(e.target.checked)}
        />
        <span>Hitboxes</span>
      </label>

      {/* Zoom Adjusters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Zoom:</span>
        <button 
          type="button" 
          onClick={() => onZoomChange(Math.max(0.25, zoomScale - 0.25))} 
          style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          -
        </button>
        <span style={{ fontWeight: 'bold', width: '35px', textAlign: 'center' }}>{(zoomScale * 100).toFixed(0)}%</span>
        <button 
          type="button" 
          onClick={() => onZoomChange(Math.min(2.0, zoomScale + 0.25))} 
          style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          +
        </button>
      </div>

      {/* Save Button with vector icon */}
      <button
        type="button"
        onClick={onSave}
        style={{
          background: 'var(--primary)',
          color: '#fff',
          border: 'none',
          padding: '0.4rem 1rem',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 4px var(--primary-glow)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          transition: 'var(--transition-smooth)'
        }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>save</span>
        <span>Save</span>
      </button>

      {/* Leave Button with vector icon */}
      <button
        type="button"
        onClick={onLeave}
        style={{
          background: 'transparent',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          padding: '0.4rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          transition: 'var(--transition-smooth)'
        }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>logout</span>
        <span>Leave</span>
      </button>
    </div>
  );
};
