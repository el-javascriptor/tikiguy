import React, { useState, useEffect } from 'react';
import settings from '../../settings.json';
import { SpriteRect, HitboxRect, AssetDefinition } from '../../types/assets';
import styles from './AssetForm.module.css';

interface AssetFormProps {
  imagePath: string;
  sprite: SpriteRect;
  hitbox: HitboxRect | null;
  render: { scale: number; offsetX: number; offsetY: number };
  onSaveSuccess: () => void;
}

type AnchorPreset = 'top-left' | 'center' | 'bottom-center' | 'custom';

export const AssetForm: React.FC<AssetFormProps> = ({
  imagePath,
  sprite,
  hitbox,
  render,
  onSaveSuccess,
}) => {
  const GRID_SIZE = settings.GRID_SIZE;

  const [assetId, setAssetId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [anchorPreset, setAnchorPreset] = useState<AnchorPreset>('top-left');
  const [anchorX, setAnchorX] = useState(0.0);
  const [anchorY, setAnchorY] = useState(0.0);
  
  const [isSolid, setIsSolid] = useState(true);
  const [isHazard, setIsHazard] = useState(false);
  const [isLadder, setIsLadder] = useState(false);
  const [isDestructible, setIsDestructible] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-update anchors when preset changes
  useEffect(() => {
    if (anchorPreset === 'top-left') {
      setAnchorX(0.0);
      setAnchorY(0.0);
    } else if (anchorPreset === 'center') {
      setAnchorX(0.5);
      setAnchorY(0.5);
    } else if (anchorPreset === 'bottom-center') {
      setAnchorX(0.5);
      setAnchorY(1.0);
    }
  }, [anchorPreset]);

  // Autofill name based on ID for ease
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setAssetId(val);
    
    const friendly = val
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setAssetName(friendly);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId) {
      setError("Asset ID is required.");
      return;
    }
    if (!assetName) {
      setError("Asset Name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    // Calculate logical width and height in grid cell counts (fallback to visual scaled dimensions for decorative assets with no hitbox)
    const gridWidth = hitbox 
      ? Math.round(hitbox.width / GRID_SIZE) 
      : Math.max(1, Math.round((sprite.width * render.scale) / GRID_SIZE));
    const gridHeight = hitbox 
      ? Math.round(hitbox.height / GRID_SIZE) 
      : Math.max(1, Math.round((sprite.height * render.scale) / GRID_SIZE));

    const assetData: AssetDefinition = {
      id: assetId,
      name: assetName,
      imagePath,
      sprite,
      hitbox,
      render,
      gridWidth,
      gridHeight,
      anchorX,
      anchorY,
      properties: {
        isSolid,
        isHazard,
        isLadder,
        isDestructible,
      },
    };

    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save asset");
      }

      onSaveSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.form}>
      {error && (
        <div className={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>Asset ID (lowercase, snake_case)</label>
        <input
          type="text"
          value={assetId}
          onChange={handleIdChange}
          placeholder="e.g. jungle_platform_02"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Asset Friendly Name</label>
        <input
          type="text"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
          placeholder="e.g. Jungle Platform 02"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Anchor Preset</label>
          <select
            value={anchorPreset}
            onChange={(e) => setAnchorPreset(e.target.value as AnchorPreset)}
            className={styles.select}
          >
            <option value="top-left">Top-Left (0.0, 0.0) - Blocks</option>
            <option value="center">Center (0.5, 0.5) - Floating</option>
            <option value="bottom-center">Bottom-Center (0.5, 1.0) - Deco</option>
            <option value="custom">Custom Sliders</option>
          </select>
        </div>
        {anchorPreset === 'custom' && (
          <div className={styles.sliderGroup}>
            <div>
              <span className={styles.sliderLabel}>Anchor X: {anchorX.toFixed(2)}</span>
              <input type="range" min="0" max="1" step="0.05" value={anchorX} onChange={(e) => setAnchorX(parseFloat(e.target.value))} className={styles.slider} />
            </div>
            <div>
              <span className={styles.sliderLabel}>Anchor Y: {anchorY.toFixed(2)}</span>
              <input type="range" min="0" max="1" step="0.05" value={anchorY} onChange={(e) => setAnchorY(parseFloat(e.target.value))} className={styles.slider} />
            </div>
          </div>
        )}
      </div>

      {/* Preview dimensions indicator */}
      {hitbox && (
        <div className={styles.infoBox}>
          📐 Occupies <strong>{hitbox.width / GRID_SIZE} × {hitbox.height / GRID_SIZE}</strong> grid tiles in-game ({hitbox.width} × {hitbox.height} px)
        </div>
      )}

      <div className={styles.panel}>
        <h4 className={styles.panelTitle}>PHYSICS PROPERTIES</h4>
        <div className={styles.checkboxGrid}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={isSolid} onChange={(e) => setIsSolid(e.target.checked)} />
            Solid (Blocks character)
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={isHazard} onChange={(e) => setIsHazard(e.target.checked)} />
            Hazard (Inflicts damage)
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={isLadder} onChange={(e) => setIsLadder(e.target.checked)} />
            Ladder (Climbable)
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={isDestructible} onChange={(e) => setIsDestructible(e.target.checked)} />
            Breakable (Destroyable)
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className={styles.submitBtn}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>save</span>
        <span>{saving ? 'Saving Asset...' : 'Save Asset to Registry'}</span>
      </button>
    </form>
  );
};
