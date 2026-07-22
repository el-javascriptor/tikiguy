# Game Engine Core Modules

This directory contains the central physics, logic, camera, and loop orchestration components of the Tikiguy Adventures game engine.

## File Registry & Functionality

1.  **[GameLoop.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/engine/GameLoop.ts)**:
    Orchestrates the frame ticking system using `requestAnimationFrame`. Calculates frame delta time in seconds, caps delta updates to `0.1s` to ensure physics stability under heavy frame drops, and invokes the `update` and `draw` lifecycle hooks.
2.  **[Input.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/engine/Input.ts)**:
    Tracks keyboard key press events for player navigation controls (`W`/`A`/`S`/`D`, `Arrow Keys`, and `Spacebar`). Implements a mouse click listener for firing darts (incorporating a latch trigger that fires only once per click). Suppresses default browser scrolling behavior for mapped keys.
3.  **[Camera.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/engine/Camera.ts)**:
    Updates viewport coordinates to center focus on the active player coordinates. Clamps offsets between `0` and `(Room Bounds - Viewport Bounds)` so that the camera frame stops scrolling immediately at the edges of the room.
4.  **[Physics.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/engine/Physics.ts)**:
    *(Placeholder for Phase 5)*. Will house Axis-Aligned Bounding Box (AABB) collisions, split-axis collision resolutions, gravity coefficients, and slope checking logic.
