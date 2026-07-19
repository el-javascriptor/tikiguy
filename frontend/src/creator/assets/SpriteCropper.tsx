import React, { useState, useRef } from 'react';
import { SpriteRect } from '../../types/assets';
import styles from './SpriteCropper.module.css';

interface SpriteCropperProps {
  imageUrl: string;
  crop: SpriteRect;
  onCropChange: (crop: SpriteRect) => void;
}

export const SpriteCropper: React.FC<SpriteCropperProps> = ({
  imageUrl,
  crop,
  onCropChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const current = getPointerCoords(e);

    const rawX = Math.min(dragStart.x, current.x);
    const rawY = Math.min(dragStart.y, current.y);
    const rawW = Math.abs(current.x - dragStart.x);
    const rawH = Math.abs(current.y - dragStart.y);

    onCropChange({
      x: Math.max(0, Math.round(rawX)),
      y: Math.max(0, Math.round(rawY)),
      width: Math.max(10, Math.round(rawW)),
      height: Math.max(10, Math.round(rawH)),
    });
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className={styles.container}>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={styles.viewport}
      >
        <img
          src={imageUrl}
          alt="Spritesheet Crop Target"
          className={styles.spritesheet}
        />
        
        {/* Selection highlighting box */}
        <div
          className={styles.cropBox}
          style={{
            left: `${crop.x}px`,
            top: `${crop.y}px`,
            width: `${crop.width}px`,
            height: `${crop.height}px`,
          }}
        >
          <span className={styles.cropLabel}>
            Crop: {crop.width}x{crop.height}px
          </span>
        </div>
      </div>
    </div>
  );
};
