import { Entity } from './Entity';
import { Input } from '../engine/Input';
import settings from '../../settings.json';

export class Player extends Entity {
  public facingLeft: boolean = false;
  private spriteImg: HTMLImageElement;
  private spriteLoaded: boolean = false;

  constructor(x: number, y: number) {
    // Initial size of Tikiguy is 48px width, 64px height (fits well in 64px grid tiles)
    super(x, y, 48, 64);

    // Set up default bounding hitbox offset to keep it slightly narrower for clean physics spacing
    this.hitboxOffset = {
      x: 8,
      y: 4,
      width: 32,
      height: 60
    };

    // Load Tikiguy image from static uploads
    this.spriteImg = new Image();
    this.spriteImg.src = '/static/uploads/tikiguy.png';
    this.spriteImg.onload = () => {
      this.spriteLoaded = true;
      
      // Fit width to exactly 1 grid tile (64px), scale height proportionally
      const gridWidth = settings.GRID_SIZE;
      this.width = gridWidth;
      if (this.spriteImg.naturalWidth > 0) {
        this.height = (this.spriteImg.naturalHeight / this.spriteImg.naturalWidth) * gridWidth;
      } else {
        this.height = 64; // fallback
      }

      // Re-adjust hitbox dynamically based on the final scale
      this.hitboxOffset = {
        x: this.width * 0.15, // 15% padding on sides
        y: this.height * 0.05, // 5% padding on top
        width: this.width * 0.7, // 70% width
        height: this.height * 0.95 // 95% height
      };
    };
  }

  /**
   * Updates player position based on keyboard input states.
   * Handles smooth friction sliding and horizontal velocity clamping.
   */
  public updatePlayer(dt: number, input: Input) {
    const accel = settings.PLAYER_ACCELERATION;
    const maxSpeed = settings.PLAYER_MAX_SPEED;
    const friction = settings.PLAYER_FRICTION;

    // 1. Horizontal acceleration & direction flipping
    if (input.isPressed('left')) {
      this.vx -= accel * dt;
      this.facingLeft = true;
    } else if (input.isPressed('right')) {
      this.vx += accel * dt;
      this.facingLeft = false;
    } else {
      // Apply smooth sliding friction deceleration
      this.vx *= (1 - friction * dt);
      if (Math.abs(this.vx) < 5) {
        this.vx = 0;
      }
    }

    // Clamp horizontal speed limit
    this.vx = Math.max(-maxSpeed, Math.min(this.vx, maxSpeed));

    // 2. Vertical movement sandbox (no-gravity flying playground for map testing)
    if (input.isPressed('up')) {
      this.vy = -maxSpeed;
    } else if (input.isPressed('down')) {
      this.vy = maxSpeed;
    } else {
      this.vy = 0;
    }

    // 3. Apply position displacements
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  /**
   * Renders the Tikiguy character on the Canvas context.
   * Flips horizontal graphics context if player faces left.
   */
  public draw(ctx: CanvasRenderingContext2D, _camX: number = 0, _camY: number = 0) {
    if (!this.spriteLoaded) return;

    // Drawn inside a pre-translated camera context, so we render at absolute coordinates!
    const renderX = Math.round(this.x);
    const renderY = Math.round(this.y);

    ctx.save();
    // Enable image smoothing specifically for the player sprite to prevent pixel jaggedness
    ctx.imageSmoothingEnabled = true;

    if (this.facingLeft) {
      // Move coordinate system to the center of the player, flip horizontal axis, and offset draw back
      ctx.translate(renderX + this.width / 2, renderY + this.height / 2);
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.spriteImg,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        this.spriteImg,
        renderX,
        renderY,
        this.width,
        this.height
      );
    }

    ctx.restore();
  }
}
