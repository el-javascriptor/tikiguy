import React from 'react';
import { AssetDefinition } from '../../types/assets';
import styles from './AreaSidebar.module.css';

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
    <div className={styles.container}>
      
      {/* Tool Select Buttons using Material Symbols Rounded */}
      <div>
        <h4 className={styles.sectionTitle}>
          EDITING TOOLS
        </h4>
        <div className={styles.toolGrid}>
          <button
            type="button"
            onClick={() => onSelectTool('brush')}
            className={`${styles.toolBtn} ${activeTool === 'brush' ? styles.toolBtnActiveBrush : ''}`}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>brush</span>
            <span>Brush</span>
          </button>
          
          <button
            type="button"
            onClick={() => onSelectTool('select')}
            className={`${styles.toolBtn} ${activeTool === 'select' ? styles.toolBtnActiveSelect : ''}`}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>near_me</span>
            <span>Select</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('eraser')}
            className={`${styles.toolBtn} ${activeTool === 'eraser' ? styles.toolBtnActiveEraser : ''}`}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>delete</span>
            <span>Eraser</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('spawn')}
            className={`${styles.toolBtn} ${activeTool === 'spawn' ? styles.toolBtnActiveSpawn : ''}`}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>directions_run</span>
            <span>Spawn</span>
          </button>
        </div>
      </div>

      {/* Brush Assets library palette */}
      <div>
        <h4 className={styles.sectionTitle}>
          ASSET BRUSHES
        </h4>
        {assets.length === 0 ? (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No assets in library.</p>
        ) : (
          <div className={styles.paletteGrid}>
            {assets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onSelectAsset(asset);
                    onSelectTool('brush'); // Auto-switch to brush tool
                  }}
                  title={asset.name}
                  className={`${styles.assetBtn} ${isSelected ? styles.assetBtnSelected : ''}`}
                >
                  {(() => {
                    // Fit container bounds (max width ~48px, max height ~48px) with aspect ratio preserved
                    const scale = Math.min(4.0, 48 / asset.sprite.width, 48 / asset.sprite.height);
                    const w = asset.sprite.width * scale;
                    const h = asset.sprite.height * scale;
                    return (
                      <div style={{
                        width: `${w}px`,
                        height: `${h}px`,
                        position: 'relative',
                        overflow: 'hidden',
                        pointerEvents: 'none'
                      }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            backgroundImage: `url(${asset.imagePath})`,
                            backgroundPosition: `-${asset.sprite.x}px -${asset.sprite.y}px`,
                            width: `${asset.sprite.width}px`,
                            height: `${asset.sprite.height}px`,
                            backgroundRepeat: 'no-repeat',
                            transform: `translate(-50%, -50%) scale(${scale})`,
                            transformOrigin: 'center center',
                            imageRendering: 'pixelated'
                          }}
                        />
                      </div>
                    );
                  })()}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
