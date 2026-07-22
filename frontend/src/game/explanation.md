# Game Engine Architecture (Phase 4 & 5 Playground)

This directory contains the core engine codebase for the 2D Metroidvania game *Tikiguy Adventures*. The engine is loaded inside the play portal page (`index.html`) and executes in the client browser.

## Directory Structure & Component Roles

### 1. Root Components
*   **[GameCanvas.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/GameCanvas.tsx)**:
    React component wrapper that mounts the gameplay HTML5 `<canvas>` element and initializes the main game engine, binding canvas contexts and input listeners.

### 2. Core Engine (`engine/`)
*   **[GameLoop.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/engine/GameLoop.ts)**:
    Orchestrates the frame loop using `requestAnimationFrame`. Drives constant physics ticks (updating entities) and rendering passes (drawing frames).
*   **[Input.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/engine/Input.ts)**:
    Keyboard event listener. Maps controls (WASD, Arrow keys, Spacebar, Mouse clicks) to active action flags for player movement and blowpipe shooting.
*   **[Physics.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/engine/Physics.ts)**:
    Handles Axis-Aligned Bounding Box (AABB) collision checks and resolution. Applies gravity factors to the player and projectiles and resolves movement against solid tiles/platforms.
*   **[Camera.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/engine/Camera.ts)**:
    Calculates viewport panning offsets to smoothly follow the player entity across the room canvas.

### 3. Rendering Pipeline (`rendering/`)
*   **[Renderer.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/rendering/Renderer.ts)**:
    Handles game frame draws. Coordinates drawing layered background details, player sprite cycles, projectile darts, and foreground assets using the active camera viewpoint.
*   **[SpriteSheet.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/rendering/SpriteSheet.ts)**:
    Utility class that loads and caches image spritesheets.

### 4. Game Entities (`entities/`)
*   **[Entity.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Entity.ts)**:
    Base physical entity class. Declares position, dimensions, velocity, collision boxes, and lifecycle updates (`update`/`draw`).
*   **[Player.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Player.ts)**:
    Tikiguy player subclass. Processes inputs, changes state (idle, running, jumping, climbing), updates animations, and fires darts.
*   **[Enemy.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Enemy.ts)**:
    Alien enemies subclass. Drives basic patrol behaviors, hazard hitbox interactions, and damage calculations.
*   **[Obstacle.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Obstacle.ts)**:
    Scaffolds static environment objects (solid blocks, hazard spikes, climbable ladders, destructible boxes).
*   **[Projectile.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Projectile.ts)**:
    Darts fired from Tikiguy's blowpipe. Appends gravity curves and checks collision bounds against walls/enemies.
