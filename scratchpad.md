# Tikiguy Adventures - Design Scratchpad

This file contains design notes, decisions, and documentation for features under active development.

---

## Completed: Phase 2 Asset Pipeline

We have established a robust, modular asset upload and configuration dashboard:
*   **SHA-256 Deduplication**: Uploaded spritesheet files are named by their SHA-256 hash. Uploading the same file twice results in a single image storage on the backend server.
*   **Custom Alignment Visual Grid**: The creator UI allows you to crop arbitrary boxes from the sheet, auto-scale them to a standard `GRID_SIZE` (64px), and freely scale/offset the visual sprite relative to the grid tiles.
*   **Grid-Snapped Hitboxes**: Dragging and resizing hitboxes snaps strictly to multiples of `GRID_SIZE`.
*   **CSS Modules**: Scoped component styling separates styles cleanly into `.module.css` bundles.

---

## Completed: Phase 3 Primitive Area Creator (Dev Portal)

We have built a fully interactive level designer portal:
*   **HTML5 Canvas Level Painter**: Replaced absolute-positioned DOM nodes with an HTML5 `<canvas>` space. Disabled image smoothing (`imageSmoothingEnabled = false`) to lock in crisp retro pixel art.
*   **Pre-loaded Texture Cache**: Uses an asynchronous image cache to store loaded spritesheets in a `useRef` map, eliminating screen flickering on pans, paints, and zooms.
*   **Glassmorphic Floating UI**: Left sidebar (Brushes palette) and top toolbar (layer switches, snap toggles, hitbox check box, saves) float absolutely above the full-screen canvas using CSS backdrop blurs and warm sandstone styling.
*   **Logical Coordinate Origin**: Draws gold dashed horizontal/vertical crosshairs indicating `(0, 0)` Room Space. Placed tiles and player spawn points are stored relative to this coordinate anchor.
*   **Shared Renderer Library (`renderer.ts`)**: Modularized all sprite cropping, scaling, offset drawing, selection outline rendering, and red physics hitbox overlays so both the Level Creator and the Game Engine draw tiles identically.
*   **Sub-Pixel Snapping Modes**:
    *   *Snap ON*: Drag-painting places solid tiles mapped to exact integer grid coordinates.
    *   *Snap OFF*: Stamping places elements mapped to decimal floats (e.g. `gridX: 4.31`, `gridY: -0.15`) for free-floating adjustments.
*   **Hover Selection Dragging**: Select any placed instance and drag it to adjust its position cell-by-cell (Snap ON) or pixel-by-pixel (Snap OFF).

---

## Completed: Phase 4 Primitive Game Engine (Playground)

We have established the core game loop, play dashboard portal, and player rendering systems:
*   **Game Portal Dashboard**: Replaced the play entry page (`index.html`) with a landing dashboard (`src/main.tsx`) showing control key bindings, fetching all custom designed rooms from Flask via `/api/areas`, and introducing tabbed navigation controls.
*   **Vanilla TS Loop**: Developed `GameLoop.ts` managing `requestAnimationFrame` timing loops and delta frame times (capped at `0.1s` to ensure physics stability).
*   **Detachable Keyboard Controls**: Coded `Input.ts` binding key event listeners, mouse click triggers (with dart shooting latch switches), and window scroll locks.
*   **Clamped Follow Camera**: Developed `Camera.ts` centering viewport coordinate offsets on the player, clamped dynamically to active block bounds and player spawn boundaries so the camera doesn't scroll into black grid areas.
*   **Smooth High-Res Scaling**: Sized the player sprite (`tikiguy.png`) proportionally based on its original aspect ratio (scaling height to a `64px` width) and enabled bilinear image smoothing (`imageSmoothingEnabled = true`) specifically for the player draw cycle so it looks smooth and clean, while block tiles remain pixelated.
*   **Drawing Order Layering**: Shifted the player draw cycle inside the camera-translated viewport exactly between the background layers and the gameplay layer. This allows foreground edges (such as grass tufts or rocks) to render *over* the player's feet.

---

## Active Phase 5: Physics & Collision (Metroidvania Core)

The next step is to introduce standard platformer physics, gravity calculations, and solid collision checks:
*   **AABB Collision Checks**: Program `Physics.ts` to compute Axis-Aligned Bounding Box (AABB) checks.
*   **Split-Axis Collision Resolution**: Resolve velocity on the horizontal axis (moving player and pushing back on wall overlap) first, then resolve velocity on the vertical axis (moving player, snapping to floor/ceiling, and updating grounded flags). This avoids diagonal clipping glitches.
*   **Gravity & Terminal Velocity**: Pull players downwards using central configurations in `settings.json` and clamp to falling thresholds.
*   **Platform Jump Controls**: Add jump physics inputs, check surface landing states, and toggle player animations.
*   **Climbable Ladders**: Override gravity and horizontal collisions when overlapping a ladder tile and holding climb controls.
*   **Blowpipe Projectiles**: Enable projectile dart physics with gravity decay curves checking collision checks against solid tiles and enemy hitboxes.
