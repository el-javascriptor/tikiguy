import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GameCanvas } from './game/GameCanvas';
import styles from './main.module.css';

function GameApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Fetch designed rooms list from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/areas');
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
          // Look for initial_area as default starting point, else select the first room
          const defaultRoom = data.find((r: any) => r.id === 'initial_area') || data[0];
          if (defaultRoom) {
            setSelectedRoomId(defaultRoom.id);
          }
        }
      } catch (err) {
        console.error("Failed to load rooms list for play portal:", err);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  const handleStartGame = () => {
    if (selectedRoomId) {
      setIsPlaying(true);
    }
  };

  const handleLeaveGame = () => {
    setIsPlaying(false);
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>TIKIGUY</h1>
          <p className={styles.subtitle}>2D METROIDVANIA PLAYGROUND</p>
        </div>

        <div className={styles.badgeGroup}>
          <a href="/creator.html" className={styles.creatorLink}>
            <span className="material-symbols-rounded">construction</span>
            <span>Creator Portal</span>
          </a>
          <div className={styles.badge}>
            <span className="material-symbols-rounded" style={{ color: 'var(--primary)' }}>sensors</span>
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        {!isPlaying ? (
          /* Start Screen Dashboard */
          <div className={styles.dashboard}>
            <section className={styles.panel}>
              <div>
                <h2 className={styles.panelTitle}>
                  <span className="material-symbols-rounded">play_circle</span>
                  <span>Launch Adventures</span>
                </h2>
                <p className={styles.panelDescription}>
                  Welcome to the Metroidvania Playground. Here you can explore custom Aztec environments
                  designed in the Level Creator, control Tikiguy, shoot blowpipe darts, and test the physics engine.
                </p>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Select Area Room</label>
                  {loadingRooms ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Querying layout registry...</p>
                  ) : rooms.length === 0 ? (
                    <p style={{ color: 'var(--volcan)', fontSize: '0.9rem' }}>
                      ⚠️ No custom rooms created yet. Go to the Creator Portal to design one!
                    </p>
                  ) : (
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className={styles.select}
                    >
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} ({room.id})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartGame}
                disabled={!selectedRoomId}
                className={styles.btnPlay}
              >
                <span className="material-symbols-rounded">sports_esports</span>
                <span>Start Playground</span>
              </button>
            </section>

            <section className={styles.panel}>
              <h2 className={styles.panelTitle}>
                <span className="material-symbols-rounded">keyboard</span>
                <span>Keyboard Controls</span>
              </h2>
              <div className={styles.controlCard}>
                <ul className={styles.controlList}>
                  <li className={styles.controlItem}>
                    <div className={styles.keyCap}>A</div>
                    <div className={styles.keyCap}>D</div>
                    <span className={styles.controlDesc}>Move horizontally (Left / Right)</span>
                  </li>
                  <li className={styles.controlItem}>
                    <div className={styles.keyCap}>W</div>
                    <div className={styles.keyCap}>Space</div>
                    <span className={styles.controlDesc}>Jump (Press W to climb ladders up)</span>
                  </li>
                  <li className={styles.controlItem}>
                    <div className={styles.keyCap}>S</div>
                    <span className={styles.controlDesc}>Climb ladders down</span>
                  </li>
                  <li className={styles.controlItem}>
                    <div className={styles.keyCap}>Click</div>
                    <span className={styles.controlDesc}>Shoot blowpipe darts</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        ) : (
          /* Game Canvas Wrapper */
          <div className={styles.gameWrapper}>
            <div className={styles.gameToolbar}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>
                🎮 PLAYING: {rooms.find(r => r.id === selectedRoomId)?.name || selectedRoomId}
              </span>
              <button
                type="button"
                onClick={handleLeaveGame}
                className={styles.btnLeave}
              >
                <span className="material-symbols-rounded">logout</span>
                <span>Exit Play</span>
              </button>
            </div>
            
            <div className={styles.canvasContainer}>
              <GameCanvas selectedRoomId={selectedRoomId} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameApp />
  </React.StrictMode>
);
