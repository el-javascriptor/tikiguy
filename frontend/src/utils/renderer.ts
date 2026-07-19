import { AssetDefinition } from '../types/assets';

/**
 * Draws a single asset instance on any Canvas 2D context.
 * Shared between the Level Editor and the Game Engine.
 */
export const drawAssetInstance = (
  ctx: CanvasRenderingContext2D,
  instance: { gridX: number; gridY: number },
  asset: AssetDefinition,
  img: HTMLImageElement,
  GRID_SIZE: number,
  options: {
    opacity?: number;
    showHitbox?: boolean;
    hitboxColor?: string;
    isSelected?: boolean;
  } = {}
) => {
  const {
    opacity = 1.0,
    showHitbox = false,
    hitboxColor = '#c0392b', // volcano red
    isSelected = false
  } = options;

  ctx.save();
  ctx.globalAlpha = opacity;

  // Calculate visual coordinates
  const renderX = instance.gridX * GRID_SIZE + asset.render.offsetX;
  const renderY = instance.gridY * GRID_SIZE + asset.render.offsetY;
  const renderW = asset.sprite.width * asset.render.scale;
  const renderH = asset.sprite.height * asset.render.scale;

  // Draw scaled spritesheet crop
  ctx.drawImage(
    img,
    asset.sprite.x,
    asset.sprite.y,
    asset.sprite.width,
    asset.sprite.height,
    renderX,
    renderY,
    renderW,
    renderH
  );

  // Draw outline if selected in editor
  if (isSelected) {
    ctx.strokeStyle = '#d4af37'; // Aztec gold highlight
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(renderX, renderY, renderW, renderH);
  }

  // Draw red physics hitbox outline
  if (showHitbox && asset.hitbox) {
    ctx.strokeStyle = hitboxColor;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.strokeRect(
      instance.gridX * GRID_SIZE + asset.hitbox.xOffset,
      instance.gridY * GRID_SIZE + asset.hitbox.yOffset,
      asset.hitbox.width,
      asset.hitbox.height
    );
  }

  ctx.restore();
};

/**
 * Draws coordinate axes crosshairs and a center dot at an origin point.
 */
export const drawOriginAxes = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number = 10000
) => {
  ctx.save();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.globalAlpha = 0.5;

  // Vertical line
  ctx.beginPath();
  ctx.moveTo(x, -size);
  ctx.lineTo(x, size);
  ctx.stroke();

  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(-size, y);
  ctx.lineTo(size, y);
  ctx.stroke();

  // Origin point dot
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
};
