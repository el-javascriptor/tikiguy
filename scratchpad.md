# Tikiguy Adventures - Design Scratchpad

This file contains design notes, decisions, and documentation for features under active development.

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

## Active Phase 4: Primitive Game Engine (Playground)

The goal of Phase 4 is to build the core game loop, load layout JSONs, and render Tikiguy:
*   **Game Loop**: Scaffolding the basic requestAnimationFrame rendering tick.
*   **Map Rendering**: Parse room JSON layouts and draw blocks on the gameplay canvas utilizing the shared `drawAssetInstance` drawing engine.
*   **Tikiguy Entity**: Load Tikiguy's sprite sheets, apply keyboard inputs (WASD), and move the sprite around.
