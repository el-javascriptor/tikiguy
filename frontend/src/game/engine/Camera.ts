import settings from '../../settings.json';

export class Camera {
  public x: number = 0;
  public y: number = 0;
  
  private viewportWidth: number;
  private viewportHeight: number;

  constructor() {
    this.viewportWidth = settings.VIEWPORT_WIDTH;
    this.viewportHeight = settings.VIEWPORT_HEIGHT;
  }

  /**
   * Updates the camera position to center on target coordinates.
   * Clamps camera coordinates within the room boundaries.
   * 
   * @param targetX The horizontal coordinate to center on (player X center)
   * @param targetY The vertical coordinate to center on (player Y center)
   * @param roomWidth Total width of the current area in pixels
   * @param roomHeight Total height of the current area in pixels
   */
  public update(targetX: number, targetY: number, roomWidth: number, roomHeight: number) {
    // Target coordinate offsets to center the player
    const rawX = targetX - this.viewportWidth / 2;
    const rawY = targetY - this.viewportHeight / 2;

    // Clamp camera coordinate values between 0 and (Room Limit - Viewport Limit)
    this.x = Math.max(0, Math.min(rawX, Math.max(0, roomWidth - this.viewportWidth)));
    this.y = Math.max(0, Math.min(rawY, Math.max(0, roomHeight - this.viewportHeight)));
  }
}
