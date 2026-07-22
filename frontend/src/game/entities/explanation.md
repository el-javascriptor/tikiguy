# Game Entities

This directory holds the base class and inheritance hierarchy representing all physical and interactable entities (player, enemies, projectiles, hazards, and layout items) in Tikiguy Adventures.

## File Registry & Functionality

1.  **[Entity.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Entity.ts)**:
    The abstract base class representing all physical objects. Sets coordinates (`x`, `y`), speeds (`vx`, `vy`), bounding dimensions (`width`, `height`), and offset hitboxes. Declares lifecycle updates (`update`/`draw`) and helper methods to query collision bounding limits (`getCollisionBounds()`).
2.  **[Player.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Player.ts)**:
    Tikiguy player subclass. Drives input evaluations (WASD / Arrows), horizontal speed accelerations, and custom friction deceleration formulas (exponential damping). Loads `/static/uploads/tikiguy.png` as its sprite, scales coordinates dynamically on load to preserve the image's original aspect ratio, and horizontally flips graphics context draws when moving left.
3.  **[Enemy.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Enemy.ts)**:
    *(Placeholder for subsequent phases)*. Will govern alien enemy AI patrols, hitbox triggers, and damage ticks.
4.  **[Obstacle.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Obstacle.ts)**:
    *(Placeholder for subsequent phases)*. Will represent breakable boxes, solid brick obstacles, and ladders.
5.  **[Projectile.ts](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/game/entities/Projectile.ts)**:
    *(Placeholder for subsequent phases)*. Will represent blowpipe darts.
