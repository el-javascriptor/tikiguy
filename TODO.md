# Tikiguy Adventures - Project Map

## Phase 1: Environment Setup
- [x] Scaffold project directory structure (folders & empty file stubs)
- [x] Define backend configuration (`requirements.txt`)
- [x] Define frontend configuration (`package.json`, `tsconfig.json`, `vite.config.ts`)
- [x] Establish initial global CSS custom properties and resets (`src/index.css`)

## Phase 2: Asset Upload & Bounding Box Configurations (Dev Portal)
- [x] Set up basic Multi-Page App entry point for Creator Dev (`creator.html`, `src/creator-main.tsx` mapped to `src/creator/main.tsx`)
- [x] Implement backend asset upload endpoint (`backend/app.py` for uploading files to `static/` and saving registry JSON)
- [x] Build front-end Asset Upload Portal (`src/creator/AssetPortal.tsx`)
  - [x] Drag-and-drop file upload to Flask server
  - [x] Visual canvas selector to draw collision bounding boxes (hitboxes) and sprite anchors on the uploaded spritesheet
  - [x] Define custom properties for assets (e.g., solid, hazard, ladder, destructible, background-decoration)
  - [x] Save configurations to backend asset registry

## Phase 3: Primitive Area Creator (Dev Portal)
- [x] Build the Area Creator canvas/grid layout editor (`src/creator/AreaCreator.tsx`)
  - [x] Load assets from the asset registry
  - [x] Brush tool to paint assets on a customizable grid (rows/cols)
  - [x] Set start location for Tikiguy (Player Spawn)
  - [x] Placement of solid tiles, hazard tiles, portal/doors, and enemy spawns
- [x] Connect save/load API routes (`backend/app.py`) for area layout files (JSON format)

## Next Action Items (Pre-Phase 4 Auditing & Testing)
- [ ] Spawn a critique agent to scan code for modularity, quality, and hidden bugs
- [ ] Manually test the new HTML5 canvas level editor and save layout files in multiple scenarios
- [ ] Fix unnecessary directories (discuss)

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
