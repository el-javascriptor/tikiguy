import React, { useState, useRef, useEffect } from 'react';
import settings from '../../settings.json';
import { AssetDefinition } from '../../types/assets';
import { AreaLayout, AreaAssetInstance } from './AreaPortal';
import { drawAssetInstance, drawOriginAxes } from '../../utils/renderer';

interface AreaGridProps {
  activeArea: AreaLayout;
  onAreaChange: (area: AreaLayout) => void;
  assets: AssetDefinition[];
  selectedAsset: AssetDefinition | null;
  activeTool: 'brush' | 'select' | 'eraser' | 'spawn';
  activeLayer: 'background_far' | 'background_near' | 'gameplay' | 'foreground';
  hitboxSnap: boolean;
  showHitboxes: boolean;
  zoomScale: number;
}

export const AreaGrid: React.FC<AreaGridProps> = ({
  activeArea,
  onAreaChange,
  assets,
  selectedAsset,
  activeTool,
  activeLayer,
  hitboxSnap,
  showHitboxes,
  zoomScale,
}) => {
  const GRID_SIZE = settings.GRID_SIZE;

  // Viewport camera translation (Panning offsets)
  const [panX, setPanX] = useState(100);
  const [panY, setPanY] = useState(100);

  // Active selection inside editor
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  // Container dimensions observer
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Refs for drawing
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Image loading cache to prevent redraw flickering
  const imageCache = useRef<Record<string, HTMLImageElement>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Drag-to-pan states
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragStartPan, setDragStartPan] = useState({ x: 0, y: 0 });

  // Brush drawing states
  const [isPainting, setIsPainting] = useState(false);
  const [lastPaintedCell, setLastPaintedCell] = useState<{ x: number; y: number } | null>(null);

  // Drag-to-move selected instance state
  const [isDraggingInstance, setIsDraggingInstance] = useState(false);
  const [instanceDragStartGrid, setInstanceDragStartGrid] = useState({ x: 0, y: 0 });
  const [instanceDragStartOffset, setInstanceDragStartOffset] = useState({ x: 0, y: 0 });

  // Observe parent container size to auto-resize canvas
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setDimensions({
          width: Math.floor(entries[0].contentRect.width),
          height: Math.floor(entries[0].contentRect.height)
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Pre-load spritesheet images
  useEffect(() => {
    let loadedCount = 0;
    const uniquePaths = Array.from(new Set(assets.map(a => a.imagePath)));
    if (uniquePaths.length === 0) {
      setImagesLoaded(true);
      return;
    }

    uniquePaths.forEach(path => {
      if (imageCache.current[path]) {
        loadedCount++;
        if (loadedCount === uniquePaths.length) setImagesLoaded(true);
        return;
      }
      const img = new Image();
      img.src = path;
      img.onload = () => {
        imageCache.current[path] = img;
        loadedCount++;
        if (loadedCount === uniquePaths.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, [assets]);

  // Canvas rendering loop
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear viewport to light mode background color (warm off-white/sandstone)
    ctx.fillStyle = '#fcfaf7';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    ctx.imageSmoothingEnabled = false; // Crisp pixelated scale rendering

    ctx.save();
    // Translate camera viewport & scale
    ctx.translate(panX, panY);
    ctx.scale(zoomScale, zoomScale);

    // A. Draw infinite grid lines in light mode (soft dark lines)
    const viewWidth = dimensions.width / zoomScale;
    const viewHeight = dimensions.height / zoomScale;
    const startGridX = Math.floor(-panX / (GRID_SIZE * zoomScale)) * GRID_SIZE - GRID_SIZE;
    const endGridX = startGridX + viewWidth + GRID_SIZE * 3;
    const startGridY = Math.floor(-panY / (GRID_SIZE * zoomScale)) * GRID_SIZE - GRID_SIZE;
    const endGridY = startGridY + viewHeight + GRID_SIZE * 3;

    ctx.strokeStyle = 'rgba(33, 43, 46, 0.07)'; // soft obsidian grid lines
    ctx.lineWidth = 1;
    for (let x = startGridX; x <= endGridX; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, startGridY);
      ctx.lineTo(x, endGridY);
      ctx.stroke();
    }
    for (let y = startGridY; y <= endGridY; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(startGridX, y);
      ctx.lineTo(endGridX, y);
      ctx.stroke();
    }

    // B. Draw coordinate center axes (0,0)
    drawOriginAxes(ctx, 0, 0);

    // C. Draw Room layout assets layer-by-layer
    if (imagesLoaded) {
      const layers: ('background_far' | 'background_near' | 'gameplay' | 'foreground')[] = [
        'background_far', 'background_near', 'gameplay', 'foreground'
      ];

      layers.forEach(layerName => {
        const isCurrent = layerName === activeLayer;
        const opacity = isCurrent ? 1.0 : 0.35; // Dim non-active layers

        activeArea.assets
          .filter(inst => inst.layer === layerName)
          .forEach(inst => {
            const asset = assets.find(a => a.id === inst.assetId);
            if (!asset) return;
            const img = imageCache.current[asset.imagePath];
            if (!img) return;

            const isSelected = selectedInstanceId === inst.instanceId;

            drawAssetInstance(ctx, inst, asset, img, GRID_SIZE, {
              opacity,
              showHitbox: showHitboxes && (activeTool === 'select' || isCurrent),
              isSelected
            });
          });
      });
    }

    // D. Draw Player Spawn Marker
    if (activeArea.playerSpawn) {
      const spawnX = activeArea.playerSpawn.x;
      const spawnY = activeArea.playerSpawn.y;

      ctx.save();
      // Render spawn anchor line
      ctx.strokeStyle = 'var(--accent)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(spawnX, spawnY);
      ctx.lineTo(spawnX, spawnY - 12);
      ctx.stroke();

      // Render Spawn Text Badge
      ctx.fillStyle = 'var(--accent)';
      ctx.beginPath();
      ctx.arc(spawnX, spawnY - 16, 8, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('S', spawnX, spawnY - 16);
      ctx.restore();
    }

    ctx.restore();
  };

  // Re-run draw when state factors change
  useEffect(() => {
    draw();
  }, [panX, panY, zoomScale, activeArea, selectedInstanceId, activeLayer, activeTool, dimensions, imagesLoaded, showHitboxes]);

  // Coordinate conversion helper
  const getWorldCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    const x = (localX - panX) / zoomScale;
    const y = (localY - panY) / zoomScale;
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button === 2 || e.button === 1 || e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setDragStartPan({ x: panX, y: panY });
      containerRef.current?.setPointerCapture(e.pointerId);
      return;
    }

    if (e.button !== 0) return;

    const world = getWorldCoords(e.clientX, e.clientY);

    if (activeTool === 'brush' && selectedAsset) {
      setIsPainting(true);
      paintCell(world.x, world.y, selectedAsset, hitboxSnap);
    } else if (activeTool === 'eraser') {
      setIsPainting(true);
      eraseCell(world.x, world.y, hitboxSnap);
    } else if (activeTool === 'spawn') {
      const snapX = hitboxSnap ? (Math.floor(world.x / GRID_SIZE) + 0.5) * GRID_SIZE : Math.round(world.x);
      const snapY = hitboxSnap ? (Math.floor(world.y / GRID_SIZE) + 0.5) * GRID_SIZE : Math.round(world.y);
      onAreaChange({
        ...activeArea,
        playerSpawn: { x: snapX, y: snapY }
      });
    } else if (activeTool === 'select') {
      const clickedInstance = findInstanceAtCoords(world.x, world.y);
      if (clickedInstance) {
        setSelectedInstanceId(clickedInstance.instanceId);
        setIsDraggingInstance(true);
        setInstanceDragStartGrid({ x: clickedInstance.gridX, y: clickedInstance.gridY });
        setInstanceDragStartOffset({ x: world.x / GRID_SIZE, y: world.y / GRID_SIZE });
        containerRef.current?.setPointerCapture(e.pointerId);
      } else {
        setSelectedInstanceId(null);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setPanX(dragStartPan.x + deltaX);
      setPanY(dragStartPan.y + deltaY);
      return;
    }

    const world = getWorldCoords(e.clientX, e.clientY);

    if (isPainting) {
      if (activeTool === 'brush' && selectedAsset) {
        paintCell(world.x, world.y, selectedAsset, hitboxSnap);
      } else if (activeTool === 'eraser') {
        eraseCell(world.x, world.y, hitboxSnap);
      }
    } else if (isDraggingInstance && selectedInstanceId) {
      const deltaGridX = (world.x / GRID_SIZE) - instanceDragStartOffset.x;
      const deltaGridY = (world.y / GRID_SIZE) - instanceDragStartOffset.y;

      let rawX = instanceDragStartGrid.x + deltaGridX;
      let rawY = instanceDragStartGrid.y + deltaGridY;

      if (hitboxSnap) {
        rawX = Math.round(rawX);
        rawY = Math.round(rawY);
      }

      updateInstanceCoords(selectedInstanceId, rawX, rawY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanning) {
      setIsPanning(false);
      containerRef.current?.releasePointerCapture(e.pointerId);
    }
    setIsPainting(false);
    setIsDraggingInstance(false);
    setLastPaintedCell(null);
  };

  const findInstanceAtCoords = (x: number, y: number): AreaAssetInstance | null => {
    for (let i = activeArea.assets.length - 1; i >= 0; i--) {
      const inst = activeArea.assets[i];
      if (inst.layer !== activeLayer) continue;

      const asset = assets.find(a => a.id === inst.assetId);
      if (!asset) continue;

      const hLeft = inst.gridX + (asset.hitbox ? asset.hitbox.xOffset / GRID_SIZE : 0);
      const hTop = inst.gridY + (asset.hitbox ? asset.hitbox.yOffset / GRID_SIZE : 0);
      const hRight = hLeft + (asset.hitbox ? asset.hitbox.width / GRID_SIZE : 1);
      const hBottom = hTop + (asset.hitbox ? asset.hitbox.height / GRID_SIZE : 1);

      const gridWorldX = x / GRID_SIZE;
      const gridWorldY = y / GRID_SIZE;

      if (gridWorldX >= hLeft && gridWorldX <= hRight && gridWorldY >= hTop && gridWorldY <= hBottom) {
        return inst;
      }
    }
    return null;
  };

  const paintCell = (worldX: number, worldY: number, asset: AssetDefinition, snap: boolean) => {
    let gridX = worldX / GRID_SIZE;
    let gridY = worldY / GRID_SIZE;

    if (snap) {
      gridX = Math.floor(gridX);
      gridY = Math.floor(gridY);

      if (lastPaintedCell && lastPaintedCell.x === gridX && lastPaintedCell.y === gridY) return;
      setLastPaintedCell({ x: gridX, y: gridY });

      const cleanedAssets = activeArea.assets.filter(a => 
        !(a.layer === activeLayer && a.gridX === gridX && a.gridY === gridY)
      );

      const newInstance: AreaAssetInstance = {
        instanceId: 'inst_' + Math.random().toString(36).substring(2, 9),
        assetId: asset.id,
        gridX,
        gridY,
        layer: activeLayer,
      };

      onAreaChange({
        ...activeArea,
        assets: [...cleanedAssets, newInstance]
      });
    } else {
      if (isPainting && lastPaintedCell) return;
      setLastPaintedCell({ x: 1, y: 1 });

      const centeredX = gridX - (asset.hitbox ? (asset.hitbox.width / GRID_SIZE) / 2 : 0.5);
      const centeredY = gridY - (asset.hitbox ? (asset.hitbox.height / GRID_SIZE) / 2 : 0.5);

      const newInstance: AreaAssetInstance = {
        instanceId: 'inst_' + Math.random().toString(36).substring(2, 9),
        assetId: asset.id,
        gridX: centeredX,
        gridY: centeredY,
        layer: activeLayer,
      };

      onAreaChange({
        ...activeArea,
        assets: [...activeArea.assets, newInstance]
      });
    }
  };

  const eraseCell = (worldX: number, worldY: number, snap: boolean) => {
    if (snap) {
      const gridX = Math.floor(worldX / GRID_SIZE);
      const gridY = Math.floor(worldY / GRID_SIZE);

      const filtered = activeArea.assets.filter(a => 
        !(a.layer === activeLayer && Math.round(a.gridX) === gridX && Math.round(a.gridY) === gridY)
      );

      onAreaChange({ ...activeArea, assets: filtered });
    } else {
      const hit = findInstanceAtCoords(worldX, worldY);
      if (hit) {
        const filtered = activeArea.assets.filter(a => a.instanceId !== hit.instanceId);
        onAreaChange({ ...activeArea, assets: filtered });
      }
    }
  };

  const updateInstanceCoords = (instanceId: string, x: number, y: number) => {
    const updated = activeArea.assets.map(a => {
      if (a.instanceId === instanceId) {
        return { ...a, gridX: x, gridY: y };
      }
      return a;
    });
    onAreaChange({ ...activeArea, assets: updated });
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%', // Fills the container box fully!
        overflow: 'hidden',
        cursor: isPanning ? 'grabbing' : 'crosshair',
        userSelect: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'block' }}
      />
      
      {/* Floating Viewport UI helpers (Cleaned up emojis) */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        background: 'rgba(252, 250, 247, 0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '0.4rem 0.8rem',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>mouse</span>
          <span><strong>Right-Click / Shift + Drag</strong>: Pan workspace</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>build</span>
          <span><strong>Tool</strong>: {activeTool.toUpperCase()} ({hitboxSnap ? 'SNAPPED' : 'FREE'})</span>
        </span>
      </div>
    </div>
  );
};
