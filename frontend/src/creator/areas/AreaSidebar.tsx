import React from 'react';
import { AssetDefinition } from '../../types/assets';

interface AreaSidebarProps {
  assets: AssetDefinition[];
  selectedAsset: AssetDefinition | null;
  onSelectAsset: (asset: AssetDefinition | null) => void;
  activeTool: 'brush' | 'select' | 'eraser' | 'spawn';
  onSelectTool: (tool: 'brush' | 'select' | 'eraser' | 'spawn') => void;
}

export const AreaSidebar: React.FC<AreaSidebarProps> = ({
  assets,
  selectedAsset,
  onSelectAsset,
  activeTool,
  onSelectTool,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Tool Select Buttons using Material Symbols Rounded */}
      <div>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', fontWeight: 800, letterSpacing: '0.05em' }}>
          EDITING TOOLS
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onSelectTool('brush')}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: activeTool === 'brush' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              background: activeTool === 'brush' ? 'var(--primary)' : 'var(--bg-medium)',
              color: activeTool === 'brush' ? '#fff' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>brush</span>
            <span>Brush</span>
          </button>
          
          <button
            type="button"
            onClick={() => onSelectTool('select')}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: activeTool === 'select' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              background: activeTool === 'select' ? 'var(--primary)' : 'var(--bg-medium)',
              color: activeTool === 'select' ? '#fff' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>near_me</span>
            <span>Select</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('eraser')}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: activeTool === 'eraser' ? '1px solid var(--volcan)' : '1px solid var(--border-color)',
              background: activeTool === 'eraser' ? 'rgba(192, 57, 43, 0.12)' : 'var(--bg-medium)',
              color: activeTool === 'eraser' ? 'var(--volcan)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', color: activeTool === 'eraser' ? 'var(--volcan)' : 'inherit' }}>delete</span>
            <span>Eraser</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('spawn')}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: activeTool === 'spawn' ? '1px solid var(--accent)' : '1px solid var(--border-color)',
              background: activeTool === 'spawn' ? 'var(--accent)' : 'var(--bg-medium)',
              color: activeTool === 'spawn' ? '#000' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>directions_run</span>
            <span>Spawn</span>
          </button>
        </div>
      </div>

      {/* Brush Assets library palette */}
      <div>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', fontWeight: 800, letterSpacing: '0.05em' }}>
          ASSET BRUSHES
        </h4>
        {assets.length === 0 ? (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No assets in library.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
            gap: '0.4rem',
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'var(--bg-medium)',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--border-color)'
          }}>
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  onSelectAsset(asset);
                  onSelectTool('brush'); // Auto-switch to brush tool
                }}
                title={asset.name}
                style={{
                  width: '100%',
                  height: '64px',
                  background: selectedAsset?.id === asset.id ? 'var(--bg-light)' : '#070a0b',
                  border: selectedAsset?.id === asset.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div
                  style={{
                    backgroundImage: `url(${asset.imagePath})`,
                    backgroundPosition: `-${asset.sprite.x}px -${asset.sprite.y}px`,
                    width: `${asset.sprite.width}px`,
                    height: `${asset.sprite.height}px`,
                    backgroundRepeat: 'no-repeat',
                    transform: `scale(${52 / Math.max(asset.sprite.width, asset.sprite.height, 52)})`
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
