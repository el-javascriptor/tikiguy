# Tikiguy Adventures - Project Map

## Phase 1: Environment Setup
- [x] Scaffold project directory structure (folders & empty file stubs)
- [ ] Define backend configuration (`requirements.txt`)
- [ ] Define frontend configuration (`package.json`, `tsconfig.json`, `vite.config.ts`)
- [ ] Establish initial global CSS custom properties and resets (`src/index.css`)

## Phase 2: Asset Upload & Bounding Box Configurations (Dev Portal)
- [ ] Set up basic Multi-Page App entry point for Creator Dev (`creator.html`, `src/creator-main.tsx`)
- [ ] Implement backend asset upload endpoint (`backend/app.py` for uploading files to `static/` and saving registry JSON)
- [ ] Build front-end Asset Upload Portal (`src/creator/AssetPortal.tsx`)
  - [ ] Drag-and-drop file upload to Flask server
  - [ ] Visual canvas selector to draw collision bounding boxes (hitboxes) and sprite anchors on the uploaded spritesheet
  - [ ] Define custom properties for assets (e.g., solid, hazard, ladder, destructible, background-decoration)
  - [ ] Save configurations to backend asset registry

## Phase 3: Primitive Area Creator (Dev Portal)
- [ ] Build the Area Creator canvas/grid layout editor (`src/creator/AreaCreator.tsx`)
  - [ ] Load assets from the asset registry
  - [ ] Brush tool to paint assets on a customizable grid (rows/cols)
  - [ ] Set start location for Tikiguy (Player Spawn)
  - [ ] Placement of solid tiles, hazard tiles, portal/doors, and enemy spawns
- [ ] Connect save/load API routes (`backend/app.py`) for area layout files (JSON format)

## Phase 4: Primitive Game Engine (Playground)
- [ ] Set up Game Portal entry point (`index.html`, `src/main.tsx`)
- [ ] Build core vanilla TS Game Loop (`src/game/engine/GameLoop.ts`)
- [ ] Implement basic canvas drawing wrapper (`src/game/GameCanvas.tsx`)
- [ ] Load and render the current area layout JSON directly onto the canvas
- [ ] Implement player entity controls (wasd/arrow keys) for basic visual position testing (no physics yet)

## Phase 5: Physics & Collision (Metroidvania Core)
- [ ] Implement standard AABB (Axis-Aligned Bounding Box) collision detection (`src/game/engine/Physics.ts`)
- [ ] Apply gravity to player & darts
- [ ] Implement collision resolution against solid obstacles and platforms
- [ ] Test movement physics, slope/boundary handling, and blowpipe shooting in the primitive canvas area
