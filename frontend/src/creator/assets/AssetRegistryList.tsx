import React from 'react';
import { AssetDefinition } from '../../types/assets';
import styles from './AssetRegistryList.module.css';

interface AssetRegistryListProps {
  registry: AssetDefinition[];
  onDelete: (id: string) => void;
}

export const AssetRegistryList: React.FC<AssetRegistryListProps> = ({ registry, onDelete }) => {
  if (registry.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        No assets registered yet. Upload a spritesheet above to get started!
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {registry.map((asset) => (
        <div key={asset.id} className={styles.card}>
          <div>
            {/* Spritesheet preview crop */}
            <div className={styles.imageContainer}>
              <div
                className={styles.imagePreview}
                style={{
                  backgroundImage: `url(${asset.imagePath})`,
                  backgroundPosition: `-${asset.sprite.x}px -${asset.sprite.y}px`,
                  width: `${asset.sprite.width}px`,
                  height: `${asset.sprite.height}px`,
                }}
              />
            </div>

            {/* Flex Header: title/ID and delete button */}
            <div className={styles.cardHeader}>
              <div>
                <strong className={styles.title}>{asset.name}</strong>
                <span className={styles.idText}>ID: {asset.id}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${asset.name}"?`)) {
                    onDelete(asset.id);
                  }
                }}
                className={styles.deleteBtn}
                title="Delete Asset"
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>delete</span>
              </button>
            </div>
          </div>

          {/* Properties Badges */}
          <div className={styles.badges}>
            {asset.properties.isSolid && (
              <span className={`${styles.badge} ${styles.solid}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>grid_view</span>
                <span>Solid</span>
              </span>
            )}
            {asset.properties.isHazard && (
              <span className={`${styles.badge} ${styles.hazard}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>warning</span>
                <span>Hazard</span>
              </span>
            )}
            {asset.properties.isLadder && (
              <span className={`${styles.badge} ${styles.ladder}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>leaderboard</span>
                <span>Ladder</span>
              </span>
            )}
            {asset.properties.isDestructible && (
              <span className={`${styles.badge} ${styles.breakable}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>heart_broken</span>
                <span>Breakable</span>
              </span>
            )}
            {!asset.properties.isSolid && !asset.properties.isHazard && !asset.properties.isLadder && !asset.properties.isDestructible && (
              <span className={`${styles.badge} ${styles.deco}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>eco</span>
                <span>Deco</span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
