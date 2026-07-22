# Level Area Creator Components

This directory contains the React components responsible for the **Area Creator Dev Portal**. These components form the workspace where level designers assembly and edit individual game rooms/areas using registered assets.

## Components & Core Files

1.  **[AreaPortal.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/areas/AreaPortal.tsx)**:
    The main layout coordinator for the Area Creator. It switches between the **Areas Catalog** list view (dashboard to load, delete, or create empty rooms) and the active **Creator Workspace** editor grid canvas. Handles backend GET/POST room layout requests.
2.  **[AreaGrid.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/areas/AreaGrid.tsx)**:
    The core HTML5 Canvas editor workspace. Manages a high-performance canvas loop that renders infinite sandstone grids, origin crosshairs `(0, 0)`, asset layer opacities, and the player spawn indicator. Processes pointer coordinates to handle:
    *   **Brush**: Painting asset blocks on the canvas.
    *   **Select**: Clicking/dragging placed blocks (adjusts grid coordinates).
    *   **Eraser**: Removing placed block instances.
    *   **Spawn**: Setting the player spawn location (snapped to the center of grid cells).
3.  **[AreaSidebar.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/areas/AreaSidebar.tsx)**:
    The floating left sidebar controller. Houses active editing tools (Brush, Select, Eraser, Spawn) and the **Asset Brushes** palette. Uses proportional aspect-ratio scaling to fit icons cleanly without overflowing their grid buttons.
4.  **[AreaToolbar.tsx](file:///home/el_javascriptor/Documents/Code/tikiguy/frontend/src/creator/areas/AreaToolbar.tsx)**:
    The floating top dashboard toolbar. Houses room title naming, active layer toggles (Far Background, Near Background, Gameplay, Foreground), grid snapping, hitbox rendering switches, zoom level adjustments, and save/leave button hooks.

## CSS Architecture
Styles are isolated using scoped CSS Modules to prevent namespace bleed:
*   `AreaPortal.module.css` (layout grids and catalog cards)
*   `AreaSidebar.module.css` (palette buttons and tool selection states)
*   `AreaToolbar.module.css` (toolbar inputs, select dropdowns, and dashboard controls)
