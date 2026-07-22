import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../../src/index.css';
import { AssetPortal } from './assets/AssetPortal';
import { AreaPortal } from './areas/AreaPortal';
import { CreatorNavbar, CreatorTab } from './components/CreatorNavbar';
import styles from './main.module.css';

function CreatorApp() {
  const [activeTab, setActiveTab] = useState<CreatorTab>('assets');

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            TIKIGUY
          </h1>
          <p className={styles.subtitle}>
            CREATOR DEV PORTAL
          </p>
        </div>

        {/* Tabbed Navigation Navbar */}
        <CreatorNavbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className={styles.pipelineBadge} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>sensors</span>
          <span>SYSTEM ONLINE</span>
        </div>
      </header>
      
      <main>
        {activeTab === 'assets' ? (
          <AssetPortal />
        ) : (
          <AreaPortal />
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CreatorApp />
  </React.StrictMode>
);
