import React, { useState, useEffect } from 'react';
import { SpriteRect, HitboxRect, AssetDefinition } from '../../types/assets';
import { AssetUploader } from './AssetUploader';
import { AssetRegistryList } from './AssetRegistryList';
import { AssetEditorCanvas } from './AssetEditorCanvas';
import { AssetForm } from './AssetForm';
import styles from './AssetPortal.module.css';

export const AssetPortal: React.FC = () => {
  const [registry, setRegistry] = useState<AssetDefinition[]>([]);
  const [spritesheetUrl, setSpritesheetUrl] = useState<string | null>(null);

  // States to bridge between editor canvas and metadata form
  const [spriteConfig, setSpriteConfig] = useState<SpriteRect>({ x: 0, y: 0, width: 64, height: 64 });
  const [hitboxConfig, setHitboxConfig] = useState<HitboxRect | null>(null);
  const [renderConfig, setRenderConfig] = useState({ scale: 1.0, offsetX: 0, offsetY: 0 });

  const fetchRegistry = async () => {
    try {
      const res = await fetch('/api/assets');
      if (res.ok) {
        const data = await res.json();
        setRegistry(data);
      }
    } catch (err) {
      console.error("Failed to load asset registry:", err);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  const handleConfigChange = (
    sprite: SpriteRect,
    hitbox: HitboxRect | null,
    render: { scale: number; offsetX: number; offsetY: number }
  ) => {
    setSpriteConfig(sprite);
    setHitboxConfig(hitbox);
    setRenderConfig(render);
  };

  const handleSaveSuccess = () => {
    fetchRegistry();
    setSpritesheetUrl(null); // Return to library view
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchRegistry();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete asset");
      }
    } catch (err) {
      console.error("Delete request failed:", err);
      alert("Failed to connect to server to delete asset.");
    }
  };

  return (
    <div className={styles.container}>
      {!spritesheetUrl ? (
        <div className={styles.container}>
          {/* Upload Spritesheet */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Upload Spritesheet</h2>
            <AssetUploader onUploadSuccess={(url) => setSpritesheetUrl(url)} />
          </section>
          
          {/* Asset Library catalog */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Asset Library</h2>
            <AssetRegistryList registry={registry} onDelete={handleDeleteAsset} />
          </section>
        </div>
      ) : (
        <div className={styles.section}>
          <div className={styles.configHeader}>
            <h2 className={styles.configTitle}>Configure New Asset</h2>
            <button 
              onClick={() => setSpritesheetUrl(null)} 
              className={styles.btnCancel}
            >
              Cancel
            </button>
          </div>

          <div className={styles.configBody}>
            {/* Left side: Sprite sheet viewer and canvas */}
            <div>
              <h3 className={styles.configColTitle}>Visual Grid-Fit & Alignment</h3>
              <AssetEditorCanvas 
                imageUrl={spritesheetUrl} 
                onConfigChange={handleConfigChange} 
              />
            </div>

            {/* Right side: Properties and Metadata form */}
            <div>
              <h3 className={styles.configColTitle}>Metadata & Physics Settings</h3>
              {hitboxConfig !== null ? (
                <AssetForm 
                  imagePath={spritesheetUrl} 
                  sprite={spriteConfig} 
                  hitbox={hitboxConfig} 
                  render={renderConfig}
                  onSaveSuccess={handleSaveSuccess} 
                />
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%', 
                  minHeight: '250px',
                  border: '2px dashed var(--border-color)', 
                  borderRadius: 'var(--border-radius)', 
                  padding: '2rem', 
                  textAlign: 'center', 
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-dark)'
                }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>content_paste</span>
                  <span>Select crop bounds in <strong>Step 1</strong> and proceed to <strong>Step 2</strong> to configure settings.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
