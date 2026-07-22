export class GameLoop {
  private lastTime: number = 0;
  private animFrameId: number | null = null;
  private running: boolean = false;

  private onUpdate: (dt: number) => void;
  private onDraw: () => void;

  /**
   * Initializes the game engine loop cycle.
   * 
   * @param onUpdate Tick updater that handles input, movement, and collision ticks (delta time in seconds)
   * @param onDraw Render passes that clears context and draws updated entities on the canvas
   */
  constructor(onUpdate: (dt: number) => void, onDraw: () => void) {
    this.onUpdate = onUpdate;
    this.onDraw = onDraw;
  }

  /**
   * Starts the requestAnimationFrame tick loop.
   */
  public start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.animFrameId = requestAnimationFrame(this.loop);
  }

  /**
   * Stalls the frame cycle and cancels the active requestAnimationFrame handle.
   */
  public stop() {
    this.running = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  /**
   * Primary frame loop execution tick.
   */
  private loop = (timestamp: number) => {
    if (!this.running) return;

    // Calculate frame delta time in seconds
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Cap delta step to safeguard physics stability from extreme frame lag or background tab throttling
    if (dt > 0.1) {
      dt = 0.1;
    }

    // Execute state updates and canvas rendering
    this.onUpdate(dt);
    this.onDraw();

    this.animFrameId = requestAnimationFrame(this.loop);
  };
}
