export class Entity {
  public x: number;
  public y: number;
  public vx: number = 0;
  public vy: number = 0;
  public width: number;
  public height: number;

  // Optional custom physical collision boundary offsets
  public hitboxOffset: { x: number; y: number; width: number; height: number } | null = null;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Evaluates position updates and state modifications.
   * To be overridden by subclasses.
   */
  public update(dt: number) {
    // Basic position step
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  /**
   * Draws the entity visually relative to the camera viewport.
   * To be overridden by subclasses.
   */
  public draw(_ctx: CanvasRenderingContext2D, _camX: number, _camY: number) {
    // Base implementation (empty / placeholder box)
  }

  /**
   * Returns the world bounding box coordinates for collision detection.
   */
  public getCollisionBounds() {
    if (this.hitboxOffset) {
      return {
        left: this.x + this.hitboxOffset.x,
        right: this.x + this.hitboxOffset.x + this.hitboxOffset.width,
        top: this.y + this.hitboxOffset.y,
        bottom: this.y + this.hitboxOffset.y + this.hitboxOffset.height,
        width: this.hitboxOffset.width,
        height: this.hitboxOffset.height,
      };
    }
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
      width: this.width,
      height: this.height,
    };
  }
}
