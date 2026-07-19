import React from 'react';
import styles from './CreatorNavbar.module.css';

export type CreatorTab = 'assets' | 'areas';

interface CreatorNavbarProps {
  activeTab: CreatorTab;
  onTabChange: (tab: CreatorTab) => void;
}

export const CreatorNavbar: React.FC<CreatorNavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.navContainer}>
      <button
        type="button"
        className={`${styles.tabBtn} ${activeTab === 'assets' ? styles.tabBtnActive : ''}`}
        onClick={() => onTabChange('assets')}
      >
        Asset Pipeline
      </button>
      <button
        type="button"
        className={`${styles.tabBtn} ${activeTab === 'areas' ? styles.tabBtnActive : ''}`}
        onClick={() => onTabChange('areas')}
      >
        Area Creator
      </button>
    </div>
  );
};
