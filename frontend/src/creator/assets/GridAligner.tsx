import React, { useState, useRef, useEffect } from 'react';
import settings from '../../settings.json';
import { SpriteRect, HitboxRect } from '../../types/assets';
import styles from './GridAligner.module.css';

interface GridAlignerProps {
  imageUrl: string;
  crop: SpriteRect;
  hitbox: HitboxRect;
  onHitboxChange: (hitbox: HitboxRect) => void;
  visualScale: number;
  onScaleChange: (scale: number) => void;
  visualOffsetX: number;
  visualOffsetY: number;
  onOffsetChange: (x: number, y: number) => void;
}

export const GridAligner: React.FC<GridAlignerProps> = ({
  imageUrl,
  crop,
  hitbox,
  onHitboxChange,
  visualScale,
  onScaleChange,
  visualOffsetX,
  visualOffsetY,
  onOffsetChange,
}) => {
  const GRID_SIZE = settings.GRID_SIZE;
  
  // Pivot buffer coordinates (Asset Origin 0,0 is offset to the middle of the workspace)
  const BUFFER_X = GRID_SIZE * 2;
  const BUFFER_Y = GRID_SIZE * 2;

  // Spritesheet original dimensions
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

  // Drag states
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartHitbox, setDragStartHitbox] = useState<HitboxRect | null>(null);
  const [dragStartSpriteOffset, setDragStartSpriteOffset] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<'move-sprite' | 'move-hitbox' | 'resize-hitbox' | null>(null);

  // Load natural dimensions of spritesheet
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
  }, [imageUrl]);

  const getPointerCoords = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    
    // Correct for mouse pointer and viewport scroll offsets
    const x = e.clientX - rect.left + containerRef.current.scrollLeft;
    const y = e.clientY - rect.top + containerRef.current.scrollTop;
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const coords = getPointerCoords(e);
    setDragStart(coords);
    setIsDrawing(true);

    setDragStartHitbox(hitbox);
    setDragStartSpriteOffset({ x: visualOffsetX, y: visualOffsetY });

    // Determine if clicking inside the hitbox or on the bottom-right resize corner
    // Hitbox screen position accounts for the BUFFER offset
    const screenHitboxLeft = BUFFER_X + hitbox.xOffset;
    const screenHitboxTop = BUFFER_Y + hitbox.yOffset;
    const screenHitboxRight = screenHitboxLeft + hitbox.width;
    const screenHitboxBottom = screenHitboxTop + hitbox.height;

    const isNearResizeEdge = 
      Math.abs(coords.x - screenHitboxRight) < 15 && 
      Math.abs(coords.y - screenHitboxBottom) < 15;

    if (isNearResizeEdge) {
      setDragType('resize-hitbox');
    } else if (
      coords.x >= screenHitboxLeft && coords.x <= screenHitboxRight &&
      coords.y >= screenHitboxTop && coords.y <= screenHitboxBottom
    ) {
      setDragType('move-hitbox');
    } else {
      setDragType('move-sprite');
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const current = getPointerCoords(e);
    const deltaX = current.x - dragStart.x;
    const deltaY = current.y - dragStart.y;

    if (dragType === 'move-sprite') {
      onOffsetChange(dragStartSpriteOffset.x + deltaX, dragStartSpriteOffset.y + deltaY);
    } else if (dragType === 'move-hitbox' && dragStartHitbox) {
      // Snaps strictly relative to origin (0,0)
      const rawX = dragStartHitbox.xOffset + deltaX;
      const rawY = dragStartHitbox.yOffset + deltaY;
      
      onHitboxChange({
        ...dragStartHitbox,
        xOffset: Math.round(rawX / GRID_SIZE) * GRID_SIZE,
        yOffset: Math.round(rawY / GRID_SIZE) * GRID_SIZE,
      });
    } else if (dragType === 'resize-hitbox' && dragStartHitbox) {
      // Snaps strictly relative to origin (0,0)
      const rawW = dragStartHitbox.width + deltaX;
      const rawH = dragStartHitbox.height + deltaY;
      
      onHitboxChange({
        ...dragStartHitbox,
        width: Math.max(GRID_SIZE, Math.round(rawW / GRID_SIZE) * GRID_SIZE),
        height: Math.max(GRID_SIZE, Math.round(rawH / GRID_SIZE) * GRID_SIZE),
      });
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    setDragType(null);
    setDragStartHitbox(null);
  };

  return (
    <div className={styles.container}>
      {/* Zoom / Scale visual slider */}
      <div className={styles.toolbar}>
        <label className={styles.sliderLabel}>
          <span>Visual Image Scale:</span>
          <input 
            type="range" 
            min="0.05" 
            max="4.0" 
            step="0.01" 
            value={visualScale} 
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.scalePercent}>{(visualScale * 100).toFixed(0)}%</span>
        </label>
        <button
          type="button"
          onClick={() => onOffsetChange(0, 0)}
          className={styles.btnReset}
        >
          Reset Offset
        </button>
      </div>

      {/* Grid Canvas Editor workspace */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={styles.viewport}
        style={{ cursor: dragType ? 'grabbing' : 'grab' }}
      >
        {/* High contrast background grid */}
        <div
          className={styles.gridOverlay}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px)`,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          }}
        />

        {/* Origin Pivot axes crosshairs (Gold lines showing origin 0,0) */}
        <div className={styles.originCrosshairX} style={{ left: `${BUFFER_X}px` }} />
        <div className={styles.originCrosshairY} style={{ top: `${BUFFER_Y}px` }} />
        <div className={styles.originDot} style={{ left: `${BUFFER_X}px`, top: `${BUFFER_Y}px` }} />

        {/* Draggable visual sprite cropped from sheet */}
        {naturalSize.w > 0 && (
          <div
            className={styles.spriteContainer}
            style={{
              left: `${BUFFER_X + visualOffsetX}px`,
              top: `${BUFFER_Y + visualOffsetY}px`,
              width: `${crop.width * visualScale}px`,
              height: `${crop.height * visualScale}px`,
            }}
          >
            <img
              src={imageUrl}
              alt="Draggable Sprite"
              className={styles.spriteImage}
              style={{
                left: `-${crop.x * visualScale}px`,
                top: `-${crop.y * visualScale}px`,
                width: `${naturalSize.w * visualScale}px`,
                height: `${naturalSize.h * visualScale}px`,
              }}
            />
          </div>
        )}

        {/* Red grid-snapped physics hitbox */}
        <div
          className={styles.hitboxOverlay}
          style={{
            left: `${BUFFER_X + hitbox.xOffset}px`,
            top: `${BUFFER_Y + hitbox.yOffset}px`,
            width: `${hitbox.width}px`,
            height: `${hitbox.height}px`,
          }}
        >
          <span className={styles.hitboxLabel}>
            Hitbox ({hitbox.width / GRID_SIZE}x{hitbox.height / GRID_SIZE})
          </span>
          <div className={styles.resizeIndicator} />
        </div>
      </div>

      <p className={styles.infoText}>
        💡 <strong>How to align:</strong> Drag the visual image freely. Drag the red box to move the collision hitbox relative to the gold <strong>Origin Dot (0,0)</strong>, or drag its bottom-right corner to resize.
      </p>
    </div>
  );
};
