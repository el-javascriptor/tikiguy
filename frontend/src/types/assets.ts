export interface SpriteRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HitboxRect {
  xOffset: number;
  yOffset: number;
  width: number;
  height: number;
}

export interface AssetDefinition {
  id: string;
  name: string;
  imagePath: string;
  sprite: SpriteRect;
  hitbox: HitboxRect | null;
  render: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
  gridWidth: number;
  gridHeight: number;
  anchorX: number;
  anchorY: number;
  properties: {
    isSolid?: boolean;
    isHazard?: boolean;
    isLadder?: boolean;
    isDestructible?: boolean;
  };
}
