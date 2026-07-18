# Tikiguy Adventures - Scratchpad

This file contains temporary design notes, ideas, and open decisions for features currently under active development.

## Feature: Asset Upload & Bounding Box Configurations (Dev Portal)

### Sprite & Sheet Management
*   **Single Sprites**: Uploading individual images (e.g., a key, a decorative statue).
*   **Sprite Sheets / Tilesets**: Uploading a single image containing a grid of assets (e.g., a tileset of ground blocks, or character animation frames).
*   **Grid Slicing**: The upload portal should allow setting grid dimensions (e.g., 16x16, 32x32 pixels) to slice the image into individual selectable tiles.

### Hitbox & Bounding Box Representation
*   Represented as a standard Axis-Aligned Bounding Box (AABB) relative to the top-left of the sprite/tile:
    ```typescript
    interface Hitbox {
        x: number;      // X offset relative to top-left of tile
        y: number;      // Y offset relative to top-left of tile
        width: number;  // Hitbox width
        height: number; // Hitbox height
    }
    ```

### Asset Properties & Tags
To keep the engine modular, assets can be tagged with properties:
*   `solid`: Impassable block (wall/floor/ceiling).
*   `platform`: One-way platform (solid only when falling onto it from above; passable from below).
*   `hazard`: Harms or resets Tikiguy on contact (e.g., spikes, lava).
*   `climbable`: Acts as a ladder.
*   `collectible`: Can be collected (keys, crystals).
*   `spawn`: Marker for where to instantiate Tikiguy or enemy types.

---

## Decisions

*   **Q1: Grid Slicing Uniformity**: Do we assume a uniform square grid (like all cells are 16x16) for a sheet, or should developers be able to draw custom arbitrary boxes around sprite cells of different sizes? *(Recommend starting with uniform grid sizes like 16x16, 32x32, or custom uniform dimensions specified at upload time).*
*   **Q2: Hitbox Complexity**: Is a single bounding box per tile/sprite sufficient, or will we need multiple bounding boxes for complex objects? *(Recommend a single AABB rectangle for simplicity and performance).*
*   **Q3: Animation Definitions**: Should the asset portal also support naming and grouping frames into animation states (e.g. "player_run", "general_idle") and defining default frame duration?
*   **Q4: Storage Format**: Should the backend store asset configuration in a single central `assets.json` index file referencing files saved in `backend/static/`?
