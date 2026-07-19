import React, { useState, useEffect } from 'react';
import { AssetDefinition } from '../../types/assets';
import { AreaToolbar } from './AreaToolbar';
import { AreaSidebar } from './AreaSidebar';
import { AreaGrid } from './AreaGrid';
import styles from './AreaPortal.module.css';

export interface AreaAssetInstance {
  instanceId: string;
  assetId: string;
  gridX: number;
  gridY: number;
  layer: 'background_far' | 'background_near' | 'gameplay' | 'foreground';
}

export interface AreaLayout {
  id: string;
  name: string;
  gridCols: number;
  gridRows: number;
  playerSpawn: { x: number; y: number } | null;
  assets: AreaAssetInstance[];
}

export const AreaPortal: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [areasList, setAreasList] = useState<any[]>([]);
  const [assets, setAssets] = useState<AssetDefinition[]>([]);
  
  // Active Room state
  const [activeArea, setActiveArea] = useState<AreaLayout | null>(null);

  // Editor states
  const [activeTool, setActiveTool] = useState<'brush' | 'select' | 'eraser' | 'spawn'>('brush');
  const [selectedAsset, setSelectedAsset] = useState<AssetDefinition | null>(null);
  const [activeLayer, setActiveLayer] = useState<'background_far' | 'background_near' | 'gameplay' | 'foreground'>('gameplay');
  const [hitboxSnap, setHitboxSnap] = useState(true);
  const [showHitboxes, setShowHitboxes] = useState(true);
  const [zoomScale, setZoomScale] = useState(1.0);

  // Form states
  const [newAreaId, setNewAreaId] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAreas = async () => {
    try {
      const res = await fetch('/api/areas');
      if (res.ok) setAreasList(await res.json());
    } catch (err) {
      console.error("Failed to fetch areas:", err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      if (res.ok) {
        const assetData = await res.json();
        setAssets(assetData);
        if (assetData.length > 0) {
          setSelectedAsset(assetData[0]); // default brush
        }
      }
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchAssets();
  }, []);

  const handleCreateArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaId || !newAreaName) {
      setFormError("Area ID and Friendly Name are required.");
      return;
    }
    
    setFormError(null);
    const cleanId = newAreaId.toLowerCase().replace(/[^a-z0-9_]/g, '');

    const defaultRoom: AreaLayout = {
      id: cleanId,
      name: newAreaName,
      gridCols: 20,
      gridRows: 15,
      playerSpawn: null,
      assets: []
    };

    try {
      const res = await fetch('/api/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultRoom)
      });

      if (res.ok) {
        setActiveArea(defaultRoom);
        setViewMode('editor');
        setNewAreaId('');
        setNewAreaName('');
      } else {
        const err = await res.json();
        setFormError(err.error || "Failed to create area layout.");
      }
    } catch (err) {
      console.error("Error creating area:", err);
      setFormError("Failed to connect to backend server.");
    }
  };

  const handleEditArea = async (areaId: string) => {
    try {
      const res = await fetch(`/api/areas/${areaId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveArea(data);
        setViewMode('editor');
      } else {
        alert("Failed to load room layout from database.");
      }
    } catch (err) {
      console.error("Error loading area:", err);
    }
  };

  const handleDeleteArea = async (areaId: string) => {
    if (!window.confirm(`Are you sure you want to delete room "${areaId}"?`)) return;

    try {
      const res = await fetch(`/api/areas/${areaId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAreas();
      } else {
        alert("Failed to delete room file.");
      }
    } catch (err) {
      console.error("Error deleting area:", err);
    }
  };

  const handleSaveArea = async () => {
    if (!activeArea) return;
    try {
      const res = await fetch('/api/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeArea)
      });
      if (res.ok) {
        alert("Area saved successfully! 💾");
      } else {
        alert("Failed to save area file to backend.");
      }
    } catch (err) {
      console.error("Error saving area:", err);
    }
  };

  const handleLeaveEditor = () => {
    fetchAreas();
    setActiveArea(null);
    setViewMode('list');
  };

  return (
    <div className={styles.container}>
      {viewMode === 'list' ? (
        /* View 1: Catalog & Creation List */
        <div className={styles.container}>
          
          {/* Create new room form */}
          <section className={styles.card}>
            <h2 className={styles.title}>
              <span className="material-symbols-rounded" style={{ color: 'var(--primary)' }}>construction</span>
              <span>Create New Area Room</span>
            </h2>
            {formError && <div style={{ color: 'var(--volcan)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>⚠️ {formError}</div>}
            <form onSubmit={handleCreateArea} className={styles.createForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Area ID (lowercase, snake_case)</label>
                <input
                  type="text"
                  placeholder="e.g. area_village_01"
                  value={newAreaId}
                  onChange={(e) => setNewAreaId(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Room Friendly Name</label>
                <input
                  type="text"
                  placeholder="e.g. Village Entrance"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <button type="submit" className={styles.btnPrimary}>
                <span className="material-symbols-rounded">add</span>
                <span>Create Area Layout</span>
              </button>
            </form>
          </section>

          {/* List of registered areas */}
          <section className={styles.card}>
            <h2 className={styles.title}>
              <span className="material-symbols-rounded" style={{ color: 'var(--primary)' }}>layers</span>
              <span>Areas Catalog</span>
            </h2>
            {areasList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No rooms designed yet. Create one above to get started!</p>
            ) : (
              <div className={styles.roomGrid}>
                {areasList.map((room) => (
                  <div key={room.id} className={styles.roomCard}>
                    <div className={styles.roomHeader}>
                      <span className={styles.roomTitle}>{room.name}</span>
                      <span className={styles.roomId}>ID: {room.id}</span>
                    </div>
                    <div className={styles.roomDetails}>
                      <span>📐 Grid Matrix: {room.gridCols} × {room.gridRows} cells</span>
                      <span>🧱 Placed Blocks: {room.instancesCount}</span>
                    </div>
                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        onClick={() => handleEditArea(room.id)}
                        className={styles.btnEdit}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>build</span>
                        <span>Edit Workspace</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteArea(room.id)}
                        className={styles.btnDelete}
                        title="Delete Room Layout"
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        /* View 2: Floating Level Grid Canvas Editor workspace */
        activeArea && (
          <div className={styles.editorWrapper}>
            {/* Floating Top Toolbar panel */}
            <div className={styles.floatingToolbar}>
              <AreaToolbar
                roomName={activeArea.name}
                onRoomNameChange={(name) => setActiveArea({ ...activeArea, name })}
                activeLayer={activeLayer}
                onLayerChange={setActiveLayer}
                hitboxSnap={hitboxSnap}
                onSnapToggle={setHitboxSnap}
                showHitboxes={showHitboxes}
                onHitboxesToggle={setShowHitboxes}
                zoomScale={zoomScale}
                onZoomChange={setZoomScale}
                onSave={handleSaveArea}
                onLeave={handleLeaveEditor}
              />
            </div>

            {/* Floating Left Sidebar Panel */}
            <aside className={styles.floatingSidebar}>
              <AreaSidebar
                assets={assets}
                selectedAsset={selectedAsset}
                onSelectAsset={setSelectedAsset}
                activeTool={activeTool}
                onSelectTool={setActiveTool}
              />
            </aside>

            {/* Full Canvas Workspace */}
            <div className={styles.canvasContainer}>
              <AreaGrid
                activeArea={activeArea}
                onAreaChange={setActiveArea}
                assets={assets}
                selectedAsset={selectedAsset}
                activeTool={activeTool}
                activeLayer={activeLayer}
                hitboxSnap={hitboxSnap}
                showHitboxes={showHitboxes}
                zoomScale={zoomScale}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};
