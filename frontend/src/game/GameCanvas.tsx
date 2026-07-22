import React, { useRef, useEffect, useState } from 'react';
import settings from '../settings.json';
import { AssetDefinition } from '../types/assets';
import { AreaLayout } from '../creator/areas/AreaPortal';
import { Input } from './engine/Input';
import { Camera } from './engine/Camera';
import { GameLoop } from './engine/GameLoop';
import { Player } from './entities/Player';
import { drawAssetInstance } from '../utils/renderer';

interface GameCanvasProps {
  selectedRoomId: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ selectedRoomId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache to store spritesheet images dynamically to prevent flicker
  const imageCache = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    let active = true;
    let loopInstance: GameLoop | null = null;
    let inputInstance: Input | null = null;

    const initGame = async () => {
      try {
        setLoading(true);
        setError(null);

        const GRID_SIZE = settings.GRID_SIZE;

        // 1. Fetch Room Layout & Asset definitions concurrently
        const [roomRes, assetsRes] = await Promise.all([
          fetch(`/api/areas/${selectedRoomId}`),
          fetch('/api/assets')
        ]);

        if (!roomRes.ok) throw new Error("Failed to load room layout from database.");
        if (!assetsRes.ok) throw new Error("Failed to load assets registry.");

        const roomData: AreaLayout = await roomRes.json();
        const assetsData: AssetDefinition[] = await assetsRes.json();

        if (!active) return;

        // 2. Pre-load spritesheet image textures
        const uniquePaths = Array.from(new Set(assetsData.map(a => a.imagePath)));
        await Promise.all(
          uniquePaths.map(path => {
            return new Promise<void>((resolve) => {
              if (imageCache.current[path]) {
                resolve();
                return;
              }
              const img = new Image();
              img.src = path;
              img.onload = () => {
                imageCache.current[path] = img;
                resolve();
              };
              img.onerror = () => {
                console.error(`Failed to load asset image: ${path}`);
                resolve(); // resolve anyway to avoid hanging startup
              };
            });
          })
        );

        if (!active) return;

        // 3. Instantiate Canvas and Engine Modules
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not acquire Canvas 2D Rendering Context.");

        inputInstance = new Input();
        const camera = new Camera();

        // Position player at configured spawn point, or fallback to center screen
        const spawnX = roomData.playerSpawn ? roomData.playerSpawn.x : 100;
        const spawnY = roomData.playerSpawn ? roomData.playerSpawn.y : 100;
        // Compensate for player width/height so player stands on spawn point
        const player = new Player(spawnX - 24, spawnY - 64);

        // Compute dynamic room boundaries that contain all tiles, player spawn, and respect coordinates
        const spawnGridX = roomData.playerSpawn ? Math.ceil(roomData.playerSpawn.x / GRID_SIZE) : 0;
        const spawnGridY = roomData.playerSpawn ? Math.ceil(roomData.playerSpawn.y / GRID_SIZE) : 0;

        const maxAssetX = roomData.assets.length > 0
          ? Math.max(...roomData.assets.map(a => {
              const asset = assetsData.find(as => as.id === a.assetId);
              return a.gridX + (asset ? asset.gridWidth : 1);
            }))
          : roomData.gridCols;
        const maxAssetY = roomData.assets.length > 0
          ? Math.max(...roomData.assets.map(a => {
              const asset = assetsData.find(as => as.id === a.assetId);
              return a.gridY + (asset ? asset.gridHeight : 1);
            }))
          : roomData.gridRows;

        const roomWidth = Math.max(spawnGridX, Math.ceil(maxAssetX)) * GRID_SIZE;
        const roomHeight = Math.max(spawnGridY, Math.ceil(maxAssetY)) * GRID_SIZE;

        // 4. Declare Loop Update & Draw Callbacks
        const update = (dt: number) => {
          if (inputInstance) {
            // Update Player movements
            player.updatePlayer(dt, inputInstance);

            // Update Camera follow positioning, clamped to bounds
            camera.update(
              player.x + player.width / 2,
              player.y + player.height / 2,
              roomWidth,
              roomHeight
            );
          }
        };

        const draw = () => {
          // Clear view context with level creator warm sandstone color
          ctx.fillStyle = '#fcfaf7';
          ctx.fillRect(0, 0, settings.VIEWPORT_WIDTH, settings.VIEWPORT_HEIGHT);
          ctx.imageSmoothingEnabled = false;

          // Save coordinate system context, shift drawing view by camera coordinates, render layers, and restore
          ctx.save();
          ctx.translate(-camera.x, -camera.y);

          // A. Draw Far & Near Backgrounds
          const backgroundLayers: ('background_far' | 'background_near')[] = ['background_far', 'background_near'];
          backgroundLayers.forEach(layerName => {
            roomData.assets
              .filter(inst => inst.layer === layerName)
              .forEach(inst => {
                const asset = assetsData.find(a => a.id === inst.assetId);
                if (!asset) return;
                const img = imageCache.current[asset.imagePath];
                if (!img) return;
                drawAssetInstance(ctx, inst, asset, img, GRID_SIZE, { showHitbox: false });
              });
          });

          // B. Draw Player (behind gameplay terrain layer!)
          player.draw(ctx);

          // C. Draw Gameplay & Foreground layers
          const foregroundLayers: ('gameplay' | 'foreground')[] = ['gameplay', 'foreground'];
          foregroundLayers.forEach(layerName => {
            roomData.assets
              .filter(inst => inst.layer === layerName)
              .forEach(inst => {
                const asset = assetsData.find(a => a.id === inst.assetId);
                if (!asset) return;
                const img = imageCache.current[asset.imagePath];
                if (!img) return;
                drawAssetInstance(ctx, inst, asset, img, GRID_SIZE, { showHitbox: false });
              });
          });

          ctx.restore();
        };

        // 5. Start Game Loop execution
        loopInstance = new GameLoop(update, draw);
        loopInstance.start();

        setLoading(false);

      } catch (err: any) {
        console.error("Failed to boot game engine playground:", err);
        if (active) {
          setError(err.message || "An error occurred during game startup.");
          setLoading(false);
        }
      }
    };

    initGame();

    return () => {
      active = false;
      if (loopInstance) {
        loopInstance.stop();
      }
      if (inputInstance) {
        inputInstance.destroy();
      }
    };
  }, [selectedRoomId]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: `${settings.VIEWPORT_WIDTH}px`, height: `${settings.VIEWPORT_HEIGHT}px` }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(252, 250, 247, 0.95)',
          backdropFilter: 'blur(8px)',
          color: 'var(--text-primary)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-sans)',
          gap: '1rem',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border-color)'
        }}>
          <span className="material-symbols-rounded" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>progress_activity</span>
          <strong>Loading adventures playground...</strong>
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(252, 250, 247, 0.95)',
          backdropFilter: 'blur(8px)',
          color: 'var(--volcan)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-sans)',
          gap: '1rem',
          borderRadius: 'var(--border-radius)',
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid var(--border-color)'
        }}>
          <span className="material-symbols-rounded" style={{ fontSize: '3rem' }}>error</span>
          <strong>Startup Failure</strong>
          <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{error}</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={settings.VIEWPORT_WIDTH}
        height={settings.VIEWPORT_HEIGHT}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          background: '#070a0b',
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
};
