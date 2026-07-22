export class Input {
  private keys: Record<string, boolean> = {};
  private clickTriggered: boolean = false;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousedown', this.handleMouseDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    this.keys[key] = true;
    this.keys[e.code.toLowerCase()] = true;

    // Prevent default scrolling behavior for standard gaming controls
    if (['space', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase()) || e.key === ' ') {
      e.preventDefault();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    this.keys[key] = false;
    this.keys[e.code.toLowerCase()] = false;
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) { // Left mouse click
      this.clickTriggered = true;
    }
  };

  /**
   * Checks if an action is currently active.
   * For 'shoot', it implements a latch/trigger check (returns true once per click).
   */
  public isPressed(action: 'left' | 'right' | 'up' | 'down' | 'jump' | 'shoot'): boolean {
    switch (action) {
      case 'left':
        return !!(this.keys['a'] || this.keys['arrowleft']);
      case 'right':
        return !!(this.keys['d'] || this.keys['arrowright']);
      case 'up':
        return !!(this.keys['w'] || this.keys['arrowup']);
      case 'down':
        return !!(this.keys['s'] || this.keys['arrowdown']);
      case 'jump':
        return !!(this.keys['w'] || this.keys['arrowup'] || this.keys[' '] || this.keys['space']);
      case 'shoot':
        const shot = this.clickTriggered;
        this.clickTriggered = false; // Reset trigger state after reading
        return shot;
      default:
        return false;
    }
  }

  /**
   * Safely detach keyboard event listeners when unmounting the game view.
   */
  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousedown', this.handleMouseDown);
  }
}
