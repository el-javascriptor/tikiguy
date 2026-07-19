# Creator Dev Portal Components

This folder contains the React components responsible for the **Creator Dev Portal**, where level designers upload assets, configure visual scaling, define grid-snapped hitboxes, and assemble gameplay areas.

## Core Files & Components

1.  **[main.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/main.tsx)**:
    The entry point mounting the `CreatorApp` shell and initializing our global CSS.
2.  **[AssetPortal.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/AssetPortal.tsx)**:
    The main coordinator panel. Fetches the assets list and manages the switch between the Asset Library and the Interactive Configurator.
3.  **[AssetUploader.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/AssetUploader.tsx)**:
    A modular drag-and-drop spritesheet uploader that posts file buffers to the backend `/api/upload` endpoint.
4.  **[AssetEditorCanvas.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/AssetEditorCanvas.tsx)**:
    The two-step visual canvas designer:
    *   **Step 1**: Free cropping of the sprite bounding box from the spritesheet (scrolling-compensated).
    *   **Step 2**: Visual positioning/scaling of the sprite on a crisp high-contrast grid, alongside dragging/resizing a collision hitbox that snaps strictly to `GRID_SIZE`.
5.  **[AssetForm.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/AssetForm.tsx)**:
    Form handling the metadata (ID, friendly name, anchor presets) and physical qualities. Calculates cell metrics before sending data to `/api/assets`.
6.  **[AssetRegistryList.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/AssetRegistryList.tsx)**:
    The visual gallery displaying registered assets with zoomed sprite previews and status tags.

## Grid Size Standard
All components import `GRID_SIZE` from **[settings.json](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/settings.json)** to keep layout snapping uniform.
