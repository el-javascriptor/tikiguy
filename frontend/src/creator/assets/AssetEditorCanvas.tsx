import React, { useState, useEffect } from 'react';
import settings from '../../settings.json';
import { SpriteRect, HitboxRect } from '../../types/assets';
import { SpriteCropper } from './SpriteCropper';
import { GridAligner } from './GridAligner';
import styles from './AssetEditorCanvas.module.css';

interface AssetEditorCanvasProps {
  imageUrl: string;
  onConfigChange: (
    sprite: SpriteRect,
    hitbox: HitboxRect | null,
    render: { scale: number; offsetX: number; offsetY: number }
  ) => void;
}

export const AssetEditorCanvas: React.FC<AssetEditorCanvasProps> = ({
  imageUrl,
  onConfigChange,
}) => {
  const GRID_SIZE = settings.GRID_SIZE;

  // Step state: 1 = Crop Sprite, 2 = Align Grid & Hitbox
  const [step, setStep] = useState<1 | 2>(1);

  // Crop State (Step 1)
  const [crop, setCrop] = useState<SpriteRect>({ x: 0, y: 0, width: GRID_SIZE, height: GRID_SIZE });

  // Alignment States (Step 2)
  const [visualScale, setVisualScale] = useState(1.0);
  const [visualOffsetX, setVisualOffsetX] = useState(0);
  const [visualOffsetY, setVisualOffsetY] = useState(0);
  
  // Hitbox State (Step 2)
  const [hitbox, setHitbox] = useState<HitboxRect | null>(null);

  // Push configurations to parent
  useEffect(() => {
    // If in Step 1, push hitbox: null to prevent saving invalid states before hitbox alignment
    if (step === 1) {
      onConfigChange(crop, null, { scale: 1.0, offsetX: 0, offsetY: 0 });
    } else {
      onConfigChange(crop, hitbox, {
        scale: visualScale,
        offsetX: visualOffsetX,
        offsetY: visualOffsetY,
      });
    }
  }, [crop, hitbox, visualScale, visualOffsetX, visualOffsetY, step]);

  // Initial calculation when switching to Step 2: auto-scale height to 1 GRID_SIZE cell
  const handleNextStep = () => {
    if (crop.height > 0) {
      const defaultScale = GRID_SIZE / crop.height;
      setVisualScale(defaultScale);
      setVisualOffsetX(0);
      setVisualOffsetY(0);
      
      // Default grid-snapped hitbox aligned at origin (0, 0)
      const cellWidths = Math.max(1, Math.round((crop.width * defaultScale) / GRID_SIZE));
      setHitbox({
        xOffset: 0,
        yOffset: 0,
        width: cellWidths * GRID_SIZE,
        height: GRID_SIZE,
      });
    }
    setStep(2);
  };

  const handleBackStep = () => {
    setHitbox(null); // Reset hitbox to force re-alignment
    setStep(1);
  };

  return (
    <div className={styles.editorWrapper}>
      
      {/* Wizard Header controls */}
      <div className={styles.headerRow}>
        <span className={styles.statusText}>
          {step === 1 ? 'Step 1: Crop sprite bounds' : 'Step 2: Align sprite on grid & hitbox'}
        </span>
        {step === 1 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className={styles.btnNext}
          >
            Next: Fit to Grid ➡️
          </button>
        ) : (
          <button
            type="button"
            onClick={handleBackStep}
            className={styles.btnBack}
          >
            ⬅️ Back to Crop
          </button>
        )}
      </div>

      {/* Conditional Viewport Rendering */}
      {step === 1 ? (
        <SpriteCropper
          imageUrl={imageUrl}
          crop={crop}
          onCropChange={setCrop}
        />
      ) : (
        hitbox && (
          <GridAligner
            imageUrl={imageUrl}
            crop={crop}
            hitbox={hitbox}
            onHitboxChange={setHitbox}
            visualScale={visualScale}
            onScaleChange={setVisualScale}
            visualOffsetX={visualOffsetX}
            visualOffsetY={visualOffsetY}
            onOffsetChange={(x, y) => {
              setVisualOffsetX(x);
              setVisualOffsetY(y);
            }}
          />
        )
      )}
    </div>
  );
};
